// app/api/cron/update-journey-status/route.ts

import { db } from '@/db'
import { journeys, dailyProgress } from '@/db/schema'
import { eq, and, lte, desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const todayString = now.toISOString().split('T')[0]

    // ✅ 1. Activate scheduled journeys (startDate <= today)
    const scheduledJourneys = await db.query.journeys.findMany({
      where: and(
        eq(journeys.status, 'scheduled'),
        lte(journeys.startDate, todayString)
      ),
    })

    const activated = []
    for (const journey of scheduledJourneys) {
      await db
        .update(journeys)
        .set({
          status: 'active',
          updatedAt: now,
        })
        .where(eq(journeys.id, journey.id))

      activated.push(journey.id)
      console.log(`✅ Activated: ${journey.id} - ${journey.title}`)
    }

    // ✅ 2. Process ACTIVE journeys (check for FROZEN or DEAD)
    const activeJourneys = await db.query.journeys.findMany({
      where: eq(journeys.status, 'active'),
    })

    const dead = []
    const frozen = []
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const sevenDaysAgoString = sevenDaysAgo.toISOString().split('T')[0]

    for (const journey of activeJourneys) {
      // Calculate expected end date
      const startDate = new Date(journey.startDate)
      const endDate = new Date(startDate)
      
      // ✅ Use isExtended to determine correct target
      const actualTarget = journey.isExtended ? journey.extendedTarget : journey.targetCheckIns
      endDate.setDate(endDate.getDate() + actualTarget)
      
      const endDateString = endDate.toISOString().split('T')[0]

      // ✅ Priority 1: Check if journey is OVERDUE (past deadline) → FROZEN
      if (todayString > endDateString) {
        await db
          .update(journeys)
          .set({
            status: 'frozen',
            frozenAt: now,
            updatedAt: now,
          })
          .where(eq(journeys.id, journey.id))

        frozen.push(journey.id)
        console.log(`❄️ Frozen (past deadline): ${journey.id} - ${journey.title}`)
        continue // Skip to next journey
      }

      // ✅ Priority 2: Check if no activity for 7+ days → DEAD
      
      // Option A: Use lastCheckInDate field (if you're maintaining it)
      if (journey.lastCheckInDate) {
        if (journey.lastCheckInDate < sevenDaysAgoString) {
          await db
            .update(journeys)
            .set({
              status: 'dead',
              deadAt: now,
              updatedAt: now,
            })
            .where(eq(journeys.id, journey.id))

          dead.push(journey.id)
          console.log(`💀 Dead (no check-in for 7+ days): ${journey.id} - ${journey.title}`)
        }
        continue
      }

      // Option B: Query dailyProgress if lastCheckInDate is not maintained
      const lastProgress = await db.query.dailyProgress.findFirst({
        where: eq(dailyProgress.journeyId, journey.id),
        orderBy: [desc(dailyProgress.date)],
      })

      // No progress entries yet, check if journey started 7+ days ago
      if (!lastProgress) {
        if (journey.startDate < sevenDaysAgoString) {
          await db
            .update(journeys)
            .set({
              status: 'dead',
              deadAt: now,
              updatedAt: now,
            })
            .where(eq(journeys.id, journey.id))

          dead.push(journey.id)
          console.log(`💀 Dead (no progress for 7+ days): ${journey.id} - ${journey.title}`)
        }
        continue
      }

      // Has progress, check if last entry was 7+ days ago
      if (lastProgress.date < sevenDaysAgoString) {
        await db
          .update(journeys)
          .set({
            status: 'dead',
            deadAt: now,
            updatedAt: now,
          })
          .where(eq(journeys.id, journey.id))

        dead.push(journey.id)
        console.log(`💀 Dead (last progress: ${lastProgress.date}): ${journey.id} - ${journey.title}`)
      }
    }

    return NextResponse.json({
      success: true,
      activated: activated.length,
      activatedIds: activated,
      dead: dead.length,
      deadIds: dead,
      frozen: frozen.length,
      frozenIds: frozen,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error('❌ Failed to update journey statuses:', error)
    return NextResponse.json(
      { error: 'Failed to update journey statuses' },
      { status: 500 }
    )
  }
}