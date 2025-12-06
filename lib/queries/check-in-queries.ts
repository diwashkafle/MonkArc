import { db } from '@/db'
import { dailyProgress } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'

// GET ALL CHECK-INS FOR A JOURNEY

export async function getJourneyCheckIns(journeyId: string) {
  return await db.query.dailyProgress.findMany({
    where: eq(dailyProgress.journeyId, journeyId),
    orderBy: [desc(dailyProgress.date)],
  })
}

// GET SINGLE CHECK-IN

export async function getCheckInByDate(journeyId: string, date: string) {
  return await db.query.dailyProgress.findFirst({
    where: and(
      eq(dailyProgress.journeyId, journeyId),
      eq(dailyProgress.date, date)
    )
  })
}

// CHECK IF ALREADY CHECKED IN TODAY

export async function hasCheckedInToday(journeyId: string) {
  const today = new Date().toISOString().split('T')[0]
  const checkIn = await getCheckInByDate(journeyId, today)
  return !!checkIn
}