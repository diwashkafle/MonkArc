import { db } from "@/db";
import { journeys } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

// get all journey for a user

export async function getUserJourneys(userId: string) {
    return await db.query.journeys.findMany({
        where: eq(journeys.userId, userId),
        orderBy: [desc(journeys.createdAt)],
    })
}
// get journey by status

export async function getActiveJourneys(userId: string) {
    return await db.query.journeys.findMany({
        where: and(
            eq(journeys.userId, userId),
            eq(journeys.status, 'active')
        ),
        orderBy: [desc(journeys.createdAt)],
    })
}

export async function getCompleteJourneys(userId: string) {
    return await db.query.journeys.findMany({
        where: and(
            eq(journeys.userId, userId),
            eq(journeys.status, 'completed')
        ),
        orderBy: [desc(journeys.createdAt)],
    })
}

// get single journey by id
export async function getJourneyById(journeyId: string,userId?:string) {
    const journey = await db.query.journeys.findFirst({
        where: eq(journeys.id, journeyId),
    })

    if(!journey) {
        return null;
    }

    if(userId && journey.userId !== userId) {
        return null;
    }

    return journey;
}

// get journey stats

export async function getJourneyStats(userId: string) {
    const allJourneys = await getUserJourneys(userId);

    const stats = {
        total: allJourneys.length,
        active: allJourneys.filter(j => j.status === 'active').length,
        completed: allJourneys.filter(j => j.status === 'completed').length,
        seeds: allJourneys.filter(j => j.phase === 'seed').length,
        arcs: allJourneys.filter(j => j.phase === 'arc').length,
        longestStreak : Math.max(...allJourneys.map(j=>j.longestStreak), 0),
        totalCheckIns: allJourneys.reduce((sum, j) => sum + j.totalCheckIns, 0),
    }

    return stats;
}

// get public journeys for profile

export async function getPublicJourney(userId:string){
    return await db.query.journeys.findMany({
        where: and(
            eq(journeys.userId, userId),
            eq(journeys.isPublic, true)
        ),
        orderBy: [desc(journeys.createdAt)]
    })
}

// GET ALL PUBLIC JOURNEYS (FOR HOMEPAGE)

export async function getPublicJourneysForFeed(limit: number = 20) {
  return await db.query.journeys.findMany({
    where: and(
      eq(journeys.isPublic, true),
      eq(journeys.phase, 'arc') // Only show Arcs on homepage
    ),
    orderBy: [desc(journeys.becameArcAt)], // Most recent Arcs first
    limit,
  })
}

// GET PUBLIC JOURNEY STATS (FOR HOMEPAGE)

export async function getPublicStats() {
  const allPublicJourneys = await db.query.journeys.findMany({
    where: eq(journeys.isPublic, true),
  })
  
  const arcs = allPublicJourneys.filter(j => j.phase === 'arc')

  const totalCheckIns = allPublicJourneys.reduce((sum, j) => sum + j.totalCheckIns, 0)
  
  return {
    totalPublicJourneys: allPublicJourneys.length,
    totalArcs: arcs.length,
    totalCheckIns,
  }
}

export async function isJourneyStuckInArc(
  journeyId: string, 
  userId: string
): Promise<boolean> {
  const journey = await db.query.journeys.findFirst({
    where: and(
      eq(journeys.id, journeyId),
      eq(journeys.userId, userId)
    )
  })

  if (!journey) return false

  return (
    journey.phase === 'arc' &&
    journey.status === 'active' &&
    !!journey.becameArcAt &&
    !journey.completedAt &&
    !journey.isExtended
  )
}