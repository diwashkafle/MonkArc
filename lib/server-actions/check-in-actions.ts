'use server'

import { db } from '@/db'
import { dailyProgress, journeys } from '@/db/schema'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq, and, sql } from 'drizzle-orm'
import { checkInSchema } from '@/lib/validation/check-in-validation'
import { getCheckInByDate } from '@/lib/queries/check-in-queries'
import { getCommitsForDate } from '@/lib/github/github-client'
import { getGitHubAccessToken } from '../github/github-status'
import { fetchCommitsViaApp } from '../github-app/fetch-commits'

// HELPER: CALCULATE STREAK
async function calculateStreak(journeyId: string, newCheckInDate: string): Promise<number> {
  const checkIns = await db.query.dailyProgress.findMany({
    where: eq(dailyProgress.journeyId, journeyId),
    orderBy: [sql`${dailyProgress.date} DESC`],
  })
  
  if (checkIns.length === 0) return 1 // First check-in
  
  const dates = checkIns.map(c => new Date(c.date))
  const newDate = new Date(newCheckInDate)
  
  let streak = 1
  const currentDate = new Date(newDate)
  currentDate.setDate(currentDate.getDate() - 1) // Start from yesterday
  
  // Go backwards and count consecutive days
  for (const checkInDate of dates) {
    const diffDays = Math.floor((currentDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      // Consecutive day found
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (diffDays > 0) {
      // Gap found, stop counting
      break
    }
  }
  
  return streak
}

// CREATE CHECK-IN

export async function createCheckIn(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  // Parse form data
  const rawData = {
    journeyId: formData.get('journeyId') as string,
    date: formData.get('date') as string,
    accomplishment: formData.get('accomplishment') as string,
    notes: formData.get('notes') as string || '',
  }
  
  // Validate
  const validationResult = checkInSchema.safeParse(rawData)
  
  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0]
    throw new Error(firstError.message)
  }
  
  const data = validationResult.data
  
  // Verify journey ownership
  const journey = await db.query.journeys.findFirst({
    where: and(
      eq(journeys.id, data.journeyId),
      eq(journeys.userId, session.user.id)
    )
  })
  
  if (!journey) {
    throw new Error('Journey not found or access denied')
  }
  
  // ✅ CRITICAL: Check if already checked in BEFORE transaction
  const existingCheckIn = await getCheckInByDate(data.journeyId, data.date)
  
  if (existingCheckIn) {
    throw new Error('You have already checked in for this date')
  }
  
  // Calculate word count from both fields
  const combinedText = `${data.accomplishment} ${data.notes || ''}`.trim()
  const wordCount = combinedText.split(/\s+/).length
  
  // Create journal text for legacy field (backwards compatibility)
  const question = "What's your progress today?"
  
  // Fetch GitHub commits if this is a project journey
  let commitCount = 0
  let githubCommits = null
  
  if (journey.repoURL) {
    try {
      const commits = await fetchCommitsViaApp(
      session.user.id,
      journey.repoURL,
      `${data.date}T00:00:00Z`,
      `${data.date}T23:59:59Z`
    )
    
    commitCount = commits.length
    
    githubCommits = commits.map(c => ({
      sha: c.sha,
      message: c.message,
      author: c.author,
      date: c.date,
      url: c.url,
    }))
          console.log(`✅ Fetched ${commitCount} commits for ${data.date}`)
    } catch (error) {
      console.error('Failed to fetch GitHub commits:', error)
      // Don't fail the check-in if GitHub fetch fails
    }
  }

  //  NEW: Calculate streak BEFORE transaction (uses read-only query)
  const newStreak = await calculateStreak(data.journeyId, data.date)
  
  // Calculate new stats
  const newTotalCheckIns = journey.totalCheckIns + 1
  const newLongestStreak = Math.max(journey.longestStreak, newStreak)
  
  const shouldBecomeArc = 
    journey.phase === 'seed' && 
    newTotalCheckIns >= journey.targetCheckIns

  const shouldCompletion = newTotalCheckIns >= journey.targetCheckIns

  // ✅ CRITICAL: Use transaction - all or nothing
  try {
    await db.transaction(async (tx) => {
      // 1. Create check-in
      await tx.insert(dailyProgress).values({
        journeyId: data.journeyId,
        date: data.date,
        accomplishment: data.accomplishment,
        notes: data.notes || null,
        wordCount,
        promptUsed: question,
        commitCount,
        githubCommits,
      })
      
      // 2. Update journey stats
      await tx.update(journeys)
        .set({
          totalCheckIns: newTotalCheckIns,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastCheckInDate: data.date,
          phase: shouldBecomeArc ? 'arc' : journey.phase,
          becameArcAt: shouldBecomeArc ? new Date() : journey.becameArcAt,
          status: 'active', 
          frozenAt: null,   
          deadAt: null,
        })
        .where(eq(journeys.id, data.journeyId))
    })
    
    revalidatePath(`/journey/${data.journeyId}`)
    revalidatePath('/dashboard')
    
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
    throw error 
  }
} // Redirect with celebration flag if became Arc
    if (shouldBecomeArc) {
      redirect(`/journey/${data.journeyId}?became-arc=true`)
    } 
    else if (shouldCompletion) {
      redirect(`/journey/${data.journeyId}?should-complete=true`)
    }
    else {
      redirect(`/journey/${data.journeyId}?checkin=true`)
    }
}

// EDIT CHECK-IN

export async function editCheckIn(checkInId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  // Get the check-in to verify ownership
  const checkIn = await db.query.dailyProgress.findFirst({
    where: eq(dailyProgress.id, checkInId),
  })

  if (!checkIn) {
    throw new Error('Check-in not found')
  }

  // Verify journey ownership
  const journey = await db.query.journeys.findFirst({
    where: eq(journeys.id, checkIn.journeyId),
  })

  if (!journey || journey.userId !== session.user.id) {
    throw new Error('Unauthorized')
  }

  // Extract form data
  const accomplishment = formData.get('accomplishment') as string
  const notes = formData.get('notes') as string

  // Validate
  if (!accomplishment || accomplishment.length < 10) {
    throw new Error('Accomplishment must be at least 10 characters')
  }

  if (accomplishment.length > 500) {
    throw new Error('Accomplishment cannot exceed 500 characters')
  }

  if (notes && notes.length > 2000) {
    throw new Error('Notes cannot exceed 2000 characters')
  }

  // Calculate word count
  const wordCount = accomplishment.trim().split(/\s+/).length

  // Update the check-in
  await db
    .update(dailyProgress)
    .set({
      accomplishment,
      notes: notes || null,
      wordCount,
      editedAt: new Date(),
    })
    .where(eq(dailyProgress.id, checkInId))

  // Revalidate paths
  revalidatePath(`/journey/${checkIn.journeyId}`)
  revalidatePath(`/journey/${checkIn.journeyId}/check-in/${checkInId}`)

  // Redirect back to check-in view
  redirect(`/journey/${checkIn.journeyId}/check-in/${checkInId}?checkin-updated=true`)
}