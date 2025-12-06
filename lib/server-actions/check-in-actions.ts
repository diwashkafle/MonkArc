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
    journal: formData.get('journal') as string,
    promptUsed: formData.get('promptUsed') as string,
    date: formData.get('date') as string,
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
  
  // Check if already checked in for this date
  const existingCheckIn = await getCheckInByDate(data.journeyId, data.date)
  
  if (existingCheckIn) {
    throw new Error('You have already checked in for this date')
  }
  
  // Calculate word count
  const wordCount = data.journal.trim().split(/\s+/).length
  
  // Fetch GitHub commits if this is a project journey
  let commitCount = 0
  let githubCommits = null
  
  if (journey.type === 'project' && journey.repoURL) {
    try {
      const commits = await getCommitsForDate(journey.repoURL, data.date)
      commitCount = commits.length
      
      // Store commit data (messages, SHAs, etc.)
      githubCommits = commits.map(c => ({
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author.name,
        date: c.commit.author.date,
        url: c.html_url,
      }))
      
      console.log(`✅ Fetched ${commitCount} commits for ${data.date}`)
    } catch (error) {
      console.error('Failed to fetch GitHub commits:', error)
      // Don't fail the check-in if GitHub fetch fails
      // Just log and continue with commitCount = 0
    }
  }
  
 // Create check-in
  await db.insert(dailyProgress).values({
    journeyId: data.journeyId,
    date: data.date,
    journal: data.journal,
    wordCount,
    promptUsed: data.promptUsed,
    commitCount,
    githubCommits,
  })
  
  // Calculate new streak
  const newStreak = await calculateStreak(data.journeyId, data.date)
  
  // Update journey stats
  const newTotalCheckIns = journey.totalCheckIns + 1
  const newLongestStreak = Math.max(journey.longestStreak, newStreak)
  
  // Check if journey should become Arc
  const shouldBecomeArc = 
    journey.phase === 'seed' && 
    newTotalCheckIns >= journey.targetCheckIns
  
  await db.update(journeys)
    .set({
      totalCheckIns: newTotalCheckIns,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastCheckInDate: data.date,
      phase: shouldBecomeArc ? 'arc' : journey.phase,
      becameArcAt: shouldBecomeArc ? new Date() : journey.becameArcAt,
      status: 'active', //  Unfreeze/revive on check-in
      frozenAt: null,   //  Clear freeze timestamp
      deadAt: null,     //  Clear death timestamp (resurrection!)
    })
    .where(eq(journeys.id, data.journeyId))
  
  revalidatePath(`/journey/${data.journeyId}`)
  revalidatePath('/dashboard')
  
  // Redirect with celebration flag if became Arc
  if (shouldBecomeArc) {
    redirect(`/journey/${data.journeyId}?became-arc=true`)
  } else {
    redirect(`/journey/${data.journeyId}`)
  }
}

// EDIT CHECK-IN

export async function editCheckIn(checkInId: string, formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  const journal = formData.get('journal') as string
  const promptUsed = formData.get('promptUsed') as string
  
  // Validate
  if (!journal || journal.length < 50) {
    throw new Error('Journal entry must be at least 50 characters')
  }
  
  // Get check-in and verify ownership
  const checkIn = await db.query.dailyProgress.findFirst({
    where: eq(dailyProgress.id, checkInId),
  })
  
  if (!checkIn) {
    throw new Error('Check-in not found')
  }
  
  const journey = await db.query.journeys.findFirst({
    where: and(
      eq(journeys.id, checkIn.journeyId),
      eq(journeys.userId, session.user.id)
    )
  })
  
  if (!journey) {
    throw new Error('Access denied')
  }
  
  // Calculate new word count
  const wordCount = journal.trim().split(/\s+/).length
  
  // Update check-in
  await db.update(dailyProgress)
    .set({
      journal,
      promptUsed,
      wordCount,
      editedAt: new Date(),
    })
    .where(eq(dailyProgress.id, checkInId))
  
  revalidatePath(`/journey/${checkIn.journeyId}`)
  
  redirect(`/journey/${checkIn.journeyId}`)
}

