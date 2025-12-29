"use server";

import { db } from "@/db";
import { journeys } from "@/db/schema";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import {
  createJourneySchema,
  editJourneySchema,
  extendedJourneySchema,
} from "@/lib/validation/journey-validation";

type ExtendedHistory = {
  id:string;
  date:Date;
  daysAdded:number;
  newTarget:number;
}

  // Create journey in database

export async function createJourney(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  // Parse resources
  const resourcesJson = formData.get('resources') as string
  let resources = []
  
  try {
    if (resourcesJson) {
      resources = JSON.parse(resourcesJson)
    }
  } catch (error) {
    console.error('Failed to parse resources:', error)
  }

  // Parse tech stack
  const techStackRaw = formData.get("techStack") as string;
  const techStack = techStackRaw
    ? techStackRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const startingDate = formData.get('startDate') as string;
  const status = new Date(startingDate) > new Date() ? 'scheduled' : 'active';
  console.log('Determined status:', status);

  // Parse form data
  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    targetCheckIns: parseInt(formData.get('targetCheckIns') as string),
    startDate: formData.get('startDate') as string,
    isPublic: formData.get('isPublic') === 'on',
    repoURL: formData.get('repoURL') as string || null, 
    techStack, 
    resources,
    status,
  }
  
  // Validate
  const validationResult = createJourneySchema.safeParse(rawData);

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    throw new Error(`${firstError.path.join('.')}: ${firstError.message}`);
  }

  const data = validationResult.data;
  
  
  // Create journey
  const [journey] = await db.insert(journeys).values({
    userId: session.user.id,
    title: data.title,
    description: data.description,
    targetCheckIns: data.targetCheckIns,
    startDate: data.startDate, 
    isPublic: data.isPublic,
    repoURL: data.repoURL, 
    techStack: data.techStack, 
    resources: data.resources,
    phase: 'seed',
    status: data.status,
    totalCheckIns: 0,
    currentStreak: 0,
    longestStreak: 0,
  }).returning()
  
  revalidatePath('/dashboard')
  redirect(`/journey/${journey.id}?created=true`)
}

// EDIT JOURNEY

export async function editJourney(journeyId: string, formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  // Verify ownership
  const journey = await db.query.journeys.findFirst({
    where: and(
      eq(journeys.id, journeyId),
      eq(journeys.userId, session.user.id)
    )
  })
  
  if (!journey) {
    throw new Error('Journey not found or access denied')
  }
  
  // Parse resources
  const resourcesJson = formData.get('resources') as string
  let resources = []
  
  try {
    if (resourcesJson) {
      resources = JSON.parse(resourcesJson)
    }
  } catch (error) {
    console.error('Failed to parse resources:', error)
  }
  
  // Parse tech stack
  const techStackRaw = formData.get('techStack') as string
  const techStack = techStackRaw
    ? techStackRaw.split(',').map((t) => t.trim()).filter(Boolean)
    : []
  
  // Parse form data
  const rawData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    isPublic: formData.get('isPublic') === 'on',
   targetCheckIns: parseInt(formData.get('targetCheckIns') as string) || null,
    startDate: formData.get('startDate') as string || null,
    repoURL: formData.get('repoURL') as string || null,
    techStack,
    resources
  }
  
  // Validate
  const validationResult = editJourneySchema.safeParse(rawData)
  
  if (!validationResult.success) {
    console.error('Validation failed:', validationResult.error.issues)
    const firstError = validationResult.error.issues[0]
    throw new Error(`${firstError.path.join('.')}: ${firstError.message}`)
  }
  
  const data = validationResult.data
  
  // Update journey (can't change: type, targetCheckIns, startDate)
  await db
    .update(journeys)
    .set({
      title: data.title,
      description: data.description,
      isPublic: data.isPublic,
      resources: data.resources,
      repoURL: data.repoURL,
      techStack: data.techStack,
      targetCheckIns: data.targetCheckIns || journey.targetCheckIns,
      startDate: data.startDate || journey.startDate,
    })
    .where(eq(journeys.id, journeyId))
  
  revalidatePath(`/journey/${journeyId}`)
  revalidatePath('/dashboard')
  if(journey.completedAt){
  redirect(`/arc/${journeyId}?updated=true`)
  }else{
      redirect(`/journey/${journeyId}?updated=true`)
  }
}

// DELETE JOURNEY

export async function deleteJourney(journeyId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const journey = await db.query.journeys.findFirst({
    where: and(
      eq(journeys.id, journeyId),
      eq(journeys.userId, session.user.id)
    ),
  });

  if (!journey) {
    throw new Error("Journey not found or access denied");
  }

  await db.delete(journeys).where(eq(journeys.id, journeyId));

  revalidatePath("/dashboard");
  redirect("/dashboard?deleted=true");
}

// PAUSE JOURNEY

export async function pauseJourney(journeyId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership and that journey is active
  const journey = await db.query.journeys.findFirst({
    where: and(
      eq(journeys.id, journeyId),
      eq(journeys.userId, session.user.id)
    ),
  });

  if (!journey) {
    throw new Error("Journey not found or access denied");
  }

  if (journey.status !== "active") {
    throw new Error("Only active journeys can be paused");
  }

  // Update to paused
  await db
    .update(journeys)
    .set({
      status: "paused",
      pausedAt: new Date(),
    })
    .where(eq(journeys.id, journeyId));

  revalidatePath(`/journey/${journeyId}`);
  revalidatePath("/dashboard");
}

// RESUME JOURNEY

export async function resumeJourney(journeyId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const journey = await db.query.journeys.findFirst({
    where: and(
      eq(journeys.id, journeyId),
      eq(journeys.userId, session.user.id)
    ),
  });

  if (!journey) {
    throw new Error("Journey not found or access denied");
  }

  if (journey.status !== "paused") {
    throw new Error("Only paused journeys can be resumed");
  }

  // Calculate paused days
  const pausedDays = journey.pausedAt
    ? Math.floor(
        (Date.now() - journey.pausedAt.getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  // Update to active
  await db
    .update(journeys)
    .set({
      status: "active",
      pausedDays: journey.pausedDays + pausedDays,
      pausedAt: null,
    })
    .where(eq(journeys.id, journeyId));

  revalidatePath(`/journey/${journeyId}`);
  revalidatePath("/dashboard");
}

// COMPLETE JOURNEY (ARC ONLY)

export async function completeJourney(journeyId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const journey = await db.query.journeys.findFirst({
    where: and(
      eq(journeys.id, journeyId),
      eq(journeys.userId, session.user.id)
    ),
  });

  if (!journey) {
    throw new Error("Journey not found or access denied");
  }

  if (journey.phase !== "arc") {
    throw new Error("Only Arc journeys can be marked as complete");
  }

  if (journey.status === "completed") {
    throw new Error("Journey is already completed")
  }

  // Update to completed
  await db
    .update(journeys)
    .set({
      becameArcAt:new Date(),
      status: "completed",
      completedAt: new Date(),
    })
    .where(eq(journeys.id, journeyId));

  revalidatePath(`/journey/${journeyId}`);
  revalidatePath("/dashboard");
}

// Extend journey

export async function extendJourney(journeyId: string, formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  const journey = await db.query.journeys.findFirst({
    where: and(
      eq(journeys.id, journeyId),
      eq(journeys.userId, session.user.id)
    ),
  })

  if (!journey) {
    throw new Error("Journey not found or access denied")
  }

  const daysToAddStr = formData.get('daysToAdd')
  
  if (!daysToAddStr) {
    throw new Error('Days to add is required')
  }
  
  const daysToAddNum = parseInt(daysToAddStr as string, 10)
  
  if (isNaN(daysToAddNum)) {
    throw new Error('Days to add must be a valid number')
  }

  const rawData = {
    daysToAdd: daysToAddNum,
  }

  const validationResult = extendedJourneySchema.safeParse(rawData)

  if (!validationResult.success) {
    console.error('Validation Failed:', validationResult.error.issues)
    const firstError = validationResult.error.issues[0]
    throw new Error(`${firstError.path.join('.')}: ${firstError.message}`)
  }

  const data = validationResult.data
  const newTarget = journey.targetCheckIns + data.daysToAdd

  await db.update(journeys)
    .set({
      isExtended: true, 
      extendedTarget: newTarget,  
      targetCheckIns: newTarget,
      originalTarget: journey.originalTarget || journey.targetCheckIns,
      timesExtended: journey.timesExtended + 1,
      lastExtendedAt: new Date(),
      extensionHistory: [
        ...(journey.extensionHistory || []),
        {
          id: crypto.randomUUID(),
          date: new Date(),
          daysAdded: data.daysToAdd,  
          newTarget: newTarget
        }
      ],
    })
    .where(eq(journeys.id, journeyId))

  revalidatePath(`/journey/${journeyId}`)
  revalidatePath('/dashboard')

  redirect(`/journey/${journeyId}`)
}