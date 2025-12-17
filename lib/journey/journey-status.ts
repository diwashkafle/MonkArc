/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from '@/db'
import { journeys } from '@/db/schema'
import { eq } from 'drizzle-orm'

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
  currentStatus: 'active' | 'paused' | 'frozen' | 'dead' | 'completed' | 'extended',
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
    
    console.log(`🔄 Journey ${journeyId} status changed: ${journey.status} → ${newStatus}`)
  }
  
  return { ...journey, status: newStatus }
}

// ========================================
// BATCH UPDATE ALL ACTIVE JOURNEYS
// ========================================

export async function updateAllJourneyStatuses() {
  // Get all active or frozen journeys (not paused, not completed, not dead)
  const activeJourneys = await db.query.journeys.findMany({
    where: eq(journeys.status, 'active')
  })
  
  const frozenJourneys = await db.query.journeys.findMany({
    where: eq(journeys.status, 'frozen')
  })
  
  const allJourneys = [...activeJourneys, ...frozenJourneys]
  
  console.log(`🔄 Checking ${allJourneys.length} journeys for status updates...`)
  
  let updatedCount = 0
  
  for (const journey of allJourneys) {
    const daysSince = daysSinceLastCheckIn(journey.lastCheckInDate, journey.startDate)
    const newStatus = determineJourneyStatus(
      journey.status,
      daysSince,
      false
    )
    
    if (newStatus !== journey.status) {
      const updates: any = {
        status: newStatus,
      }
      
      if (newStatus === 'frozen' && !journey.frozenAt) {
        updates.frozenAt = new Date()
        updates.currentStreak = 0
      }
      
      if (newStatus === 'dead' && !journey.deadAt) {
        updates.deadAt = new Date()
        updates.currentStreak = 0
      }
      
      await db.update(journeys)
        .set(updates)
        .where(eq(journeys.id, journey.id))
      
      updatedCount++
      console.log(`✅ Updated journey "${journey.title}": ${journey.status} → ${newStatus}`)
    }
  }
  
  console.log(`✅ Updated ${updatedCount} journey statuses`)
  
  return { total: allJourneys.length, updated: updatedCount }
}