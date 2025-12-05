'use server'

import { db } from '@/db'
import { journeys } from '@/db/schema'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { 
  learningJourneySchema, 
  projectJourneySchema,
} from '@/lib/validation/journey-validation';

// HELPER: PARSE FORM DATA

function parseFormData(formData: FormData) {
  return {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    targetCheckIns: parseInt(formData.get('targetCheckIns') as string),
    startDate: formData.get('startDate') as string,
    isPublic: formData.get('isPublic') === 'on',
  }
}

// CREATE LEARNING JOURNEY

export async function createLearningJourney(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  // Parse form data
  const rawData = {
    ...parseFormData(formData),
    coreResource: (formData.get('coreResource') as string) || '',
  }
  
  // Validate with Zod
  const validationResult = learningJourneySchema.safeParse(rawData)
  
  if (!validationResult.success) {
    // Return first error message
    const firstError = validationResult.error.issues[0]
    throw new Error(firstError.message)
  }
  
  const data = validationResult.data
  
  // Insert into database
  const [newJourney] = await db.insert(journeys).values({
    userId: session.user.id,
    type: 'learning',
    title: data.title,
    description: data.description,
    targetCheckIns: data.targetCheckIns,
    startDate: data.startDate,
    coreResource: data.coreResource || null,
    isPublic: data.isPublic,
    phase: 'seed',
    status: 'active',
  }).returning()
  
  revalidatePath('/dashboard')
  redirect(`/journey/${newJourney.id}`)
}

// CREATE PROJECT JOURNEY

export async function createProjectJourney(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  
  // Parse form data
  const techStackRaw = formData.get('techStack') as string
  const techStack = techStackRaw
    ? techStackRaw.split(',').map(t => t.trim()).filter(Boolean)
    : []
  
  const rawData = {
    ...parseFormData(formData),
    deliverable: formData.get('deliverable') as string,
    repoURL: formData.get('repoURL') as string,
    techStack,
  }
  
  // Validate with Zod
  const validationResult = projectJourneySchema.safeParse(rawData)
  
  if (!validationResult.success) {
    const firstError = validationResult.error.issues[0]
    throw new Error(firstError.message)
  }
  
  const data = validationResult.data
  
  // Insert into database
  const [newJourney] = await db.insert(journeys).values({
    userId: session.user.id,
    type: 'project',
    title: data.title,
    description: data.description,
    deliverable: data.deliverable,
    targetCheckIns: data.targetCheckIns,
    startDate: data.startDate,
    repoURL: data.repoURL,
    techStack: data.techStack,
    isPublic: data.isPublic,
    phase: 'seed',
    status: 'active',
  }).returning()
  
  revalidatePath('/dashboard')
  redirect(`/journey/${newJourney.id}`)
}