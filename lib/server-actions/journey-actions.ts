"use server";

import { db } from "@/db";
import { journeys } from "@/db/schema";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import {
  learningJourneySchema,
  projectJourneySchema,
  editJourneySchema,
} from "@/lib/validation/journey-validation";

// HELPER: PARSE FORM DATA

function parseFormData(formData: FormData) {
  return {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    targetCheckIns: parseInt(formData.get("targetCheckIns") as string),
    startDate: formData.get("startDate") as string,
    isPublic: formData.get("isPublic") === "on",
  };
}

// CREATE LEARNING JOURNEY

export async function createLearningJourney(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    ...parseFormData(formData),
    coreResource: (formData.get("coreResource") as string) || "",
  };

  const validationResult = learningJourneySchema.safeParse(rawData);

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    throw new Error(firstError.message);
  }

  const data = validationResult.data;

  const [newJourney] = await db
    .insert(journeys)
    .values({
      userId: session.user.id,
      type: "learning",
      title: data.title,
      description: data.description,
      targetCheckIns: data.targetCheckIns,
      startDate: data.startDate,
      coreResource: data.coreResource || null,
      isPublic: data.isPublic,
      phase: "seed",
      status: "active",
    })
    .returning();

  revalidatePath("/dashboard");
  redirect(`/journey/${newJourney.id}`);
}

// CREATE PROJECT JOURNEY

export async function createProjectJourney(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const techStackRaw = formData.get("techStack") as string;
  const techStack = techStackRaw
    ? techStackRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const rawData = {
    ...parseFormData(formData),
    deliverable: formData.get("deliverable") as string,
    repoURL: formData.get("repoURL") as string,
    techStack,
  };

  const validationResult = projectJourneySchema.safeParse(rawData);

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    throw new Error(firstError.message);
  }

  const data = validationResult.data;

  const [newJourney] = await db
    .insert(journeys)
    .values({
      userId: session.user.id,
      type: "project",
      title: data.title,
      description: data.description,
      deliverable: data.deliverable,
      targetCheckIns: data.targetCheckIns,
      startDate: data.startDate,
      repoURL: data.repoURL,
      techStack: data.techStack,
      isPublic: data.isPublic,
      phase: "seed",
      status: "active",
    })
    .returning();

  revalidatePath("/dashboard");
  redirect(`/journey/${newJourney.id}`);
}

// EDIT JOURNEY

export async function editJourney(journeyId: string, formData: FormData) {
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

  // Parse form data
  const techStackRaw = formData.get("techStack") as string;
  const techStack = techStackRaw
    ? techStackRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    isPublic: formData.get("isPublic") === "on",
    coreResource: (formData.get("coreResource") as string) || "",
    deliverable: (formData.get("deliverable") as string) || undefined,
    repoURL: (formData.get("repoURL") as string) || undefined,
    techStack: techStack.length > 0 ? techStack : undefined,
  };

  // Validate
  const validationResult = editJourneySchema.safeParse(rawData);

  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0];
    throw new Error(firstError.message);
  }

  const data = validationResult.data;

  // Update database
  await db
    .update(journeys)
    .set({
      title: data.title,
      description: data.description,
      isPublic: data.isPublic,
      coreResource: data.coreResource || null,
      deliverable: data.deliverable || journey.deliverable,
      repoURL: data.repoURL || journey.repoURL,
      techStack: data.techStack || journey.techStack,
      updatedAt: new Date(),
    })
    .where(eq(journeys.id, journeyId));

  revalidatePath(`/journey/${journeyId}`);
  revalidatePath("/dashboard");
  redirect(`/journey/${journeyId}`);
}

// DELETE JOURNEY

export async function deleteJourney(journeyId: string) {
  console.log("deleteJourney called with id:", journeyId);
  const session = await auth();
  console.log("session:", session);

  if (!session?.user?.id) {
    console.log("no session user id");
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const journey = await db.query.journeys.findFirst({
    where: and(
      eq(journeys.id, journeyId),
      eq(journeys.userId, session.user.id)
    ),
  });
  console.log("Journey found:", journey ? "YES" : "NO");

  if (!journey) {
    console.log("❌ Journey not found or access denied");

    throw new Error("Journey not found or access denied");
  }
  console.log("✅ Deleting journey...");

  // Delete (cascades to daily_progress, milestones, leaves)
  await db.delete(journeys).where(eq(journeys.id, journeyId));
  console.log('✅ Journey deleted successfully')
  console.log('===================================')

  revalidatePath("/dashboard");
  redirect("/dashboard");
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

  // Update to completed
  await db
    .update(journeys)
    .set({
      status: "completed",
      completedAt: new Date(),
    })
    .where(eq(journeys.id, journeyId));

  revalidatePath(`/journey/${journeyId}`);
  revalidatePath("/dashboard");
}
