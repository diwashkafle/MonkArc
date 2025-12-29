/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '@/db'
import { journeys } from '@/db/schema'
import { and, eq, lt, sql } from 'drizzle-orm'

// CALCULATE DAYS SINCE LAST CHECK-IN

export function daysSinceLastCheckIn(lastCheckInDate: string | null, startDateInDate: string | null): number {
  const baseDate = lastCheckInDate ?? startDateInDate;

  if(!baseDate){
    return 0;
  }
  const last = new Date(baseDate)
  const today = new Date()
  
  // Reset time to midnight for accurate day calculation
  last.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  
  const diffTime = today.getTime() - last.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

// DETERMINE JOURNEY STATUS

export function determineJourneyStatus(
  currentStatus: 'active' | 'paused' | 'frozen' | 'dead' | 'completed' | 'extended' | 'scheduled',
  daysSinceCheckIn: number,
  isPaused: boolean
): 'active' | 'paused' | 'frozen' | 'dead' {
  // Don't change status if completed or manually paused
  if (currentStatus === 'completed') return 'active' // Keep completed as-is
  if (isPaused) return 'paused' // Keep paused as-is
  
  // Apply freeze/death rules
  if (daysSinceCheckIn >= 7) {
    return 'dead'
  } else if (daysSinceCheckIn >= 3) {
    return 'frozen'
  } else {
    return 'active'
  }
}

// UPDATE JOURNEY STATUS BASED ON ACTIVITY

export async function updateJourneyStatusByActivity(journeyId: string) {
  const journey = await db.query.journeys.findFirst({
    where: eq(journeys.id, journeyId)
  })
  
  if (!journey) {
    throw new Error('Journey not found')
  }
  
  // Don't update if completed or manually paused
  if (journey.status === 'completed' || journey.status === 'paused') {
    return journey
  }

  const checkIsPaused = ()=> journey.status === 'paused';
  
  const daysSince = daysSinceLastCheckIn(journey.lastCheckInDate, journey.startDate)
  const newStatus = determineJourneyStatus(
    journey.status,
    daysSince,
    checkIsPaused()
  )
  
  // Only update if status changed
  if (newStatus !== journey.status) {
    const updates: any = {
      status: newStatus,
    }
    
    if (newStatus === 'frozen' && !journey.frozenAt) {
      updates.frozenAt = new Date()
      updates.currentStreak = 0 // Break streak when frozen
    }
    
    if (newStatus === 'dead' && !journey.deadAt) {
      updates.deadAt = new Date()
      updates.currentStreak = 0 // Break streak when dead
    }
    
    await db.update(journeys)
      .set(updates)
      .where(eq(journeys.id, journeyId))
    
  }
  
  return { ...journey, status: newStatus }
}

// BATCH UPDATE ALL ACTIVE JOURNEYS

export async function updateAllJourneyStatuses() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Calculate cutoff dates
  const threeDaysAgo = new Date(today)
  threeDaysAgo.setDate(today.getDate() - 3)
  const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0]
  
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 7)
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]
  
  //  BATCH UPDATE 1: Freeze active journeys (3+ days inactive)
  const frozenResult = await db
    .update(journeys)
    .set({
      status: 'frozen',
      frozenAt: sql`COALESCE(frozen_at, NOW())`, // Only set if not already set
      // Don't reset streak on freeze - preserve it!
    })
    .where(
      and(
        eq(journeys.status, 'active'),
        lt(journeys.lastCheckInDate, threeDaysAgoStr)
      )
    )
    .returning({ id: journeys.id, title: journeys.title })
  
  const frozenCount = frozenResult.length
  
  
  // BATCH UPDATE 2: Kill frozen journeys (7+ days inactive total)
  const deadResult = await db
    .update(journeys)
    .set({
      status: 'dead',
      deadAt: sql`COALESCE(dead_at, NOW())`, // Only set if not already set
      currentStreak: 0, //  Reset streak when dead
    })
    .where(
      and(
        eq(journeys.status, 'frozen'),
        lt(journeys.lastCheckInDate, sevenDaysAgoStr)
      )
    )
    .returning({ id: journeys.id, title: journeys.title })
  
  const deadCount = deadResult.length
  
  
  //  Summary
  const total = frozenCount + deadCount  
  return {
    total,
    updated: {
      frozen: frozenCount,
      dead: deadCount
    }
  }
}