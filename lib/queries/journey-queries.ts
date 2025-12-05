import { db } from "@/db";
import { journeys, users } from "@/db/schema";
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

// get journey by type
export async function getLearningJourneys(userId: string) {
    return await db.query.journeys.findMany({
        where: and(
            eq(journeys.userId, userId),
            eq(journeys.type, 'learning')
        ),
        orderBy: [desc(journeys.createdAt)],
    })
}

export async function getProjectJourneys(userId: string) {
    return await db.query.journeys.findMany({
        where: and(
            eq(journeys.userId, userId),
            eq(journeys.type, 'project')
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
