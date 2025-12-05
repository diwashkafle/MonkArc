'use server'

import {db} from '@/db';
import {journeys} from '@/db/schema';
import {auth} from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

//create learning journey
export async function createLearningJourney(formData:FormData){
    const session = await auth();

    if(!session?.user?.id){
        throw new Error('Unauthorized');
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const targetCheckIns = parseInt(formData.get('targetCheckIns') as string);
    const startDate = formData.get('startDate') as string;
    const coreResources = formData.get('coreResources') as string;
    const isPublic = formData.get('isPublic') === 'on';

    // Validation
  if (!title || title.length < 3) {
    throw new Error('Title must be at least 3 characters')
  }
  
  if (!description || description.length < 10) {
    throw new Error('Description must be at least 10 characters')
  }
  
  if (!targetCheckIns || targetCheckIns < 7 || targetCheckIns > 365) {
    throw new Error('Target check-ins must be between 7 and 365')
  }
  
  if (!startDate) {
    throw new Error('Start date is required')
  }

  const [newJourney] = await db.insert(journeys).values({
    userId: session.user.id,
    type: 'learning',
    title: title.trim(),
    description: description.trim(),
    targetCheckIns,
    startDate,
    coreResource: coreResources || null,
    isPublic,
    phase:'seed',
    status:'active',
  }).returning()

  revalidatePath('/dashboard')

  redirect(`/journey/${newJourney.id}`);

}

// create project journey

export async function createProjectJourney(formData:FormData){

    const session = await auth();

    if(!session?.user?.id){
        throw new Error('Unauthorized');
    }

    // Extract form data
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const deliverable = formData.get('deliverable') as string
  const targetCheckIns = parseInt(formData.get('targetCheckIns') as string)
  const startDate = formData.get('startDate') as string
  const repoURL = formData.get('repoURL') as string
  const techStackRaw = formData.get('techStack') as string
  const isPublic = formData.get('isPublic') === 'on'

  // parse tech stack ( comma - separated)

  const techStack = techStackRaw ? techStackRaw.split(',').map(tech => tech.trim()) : []

  // validation // Validation
  if (!title || title.length < 3) {
    throw new Error('Title must be at least 3 characters')
  }
  
  if (!description || description.length < 10) {
    throw new Error('Description must be at least 10 characters')
  }
  
  if (!deliverable || deliverable.length < 10) {
    throw new Error('Deliverable must be at least 10 characters')
  }
  
  if (!targetCheckIns || targetCheckIns < 7 || targetCheckIns > 365) {
    throw new Error('Target check-ins must be between 7 and 365')
  }
  
  if (!startDate) {
    throw new Error('Start date is required')
  }
  
  if (!repoURL) {
    throw new Error('GitHub repository URL is required for projects')
  }
  
  // Validate GitHub URL format
  if (!repoURL.includes('github.com')) {
    throw new Error('Must be a valid GitHub repository URL')
  }

  // Insert new project journey into the database
    const [newJourney] = await db.insert(journeys).values({
        userId: session.user.id,
    type: 'project',
    title: title.trim(),
    description: description.trim(),
    deliverable: deliverable.trim(),
    targetCheckIns,
    startDate,
    repoURL: repoURL.trim(),
    techStack,
    isPublic,
    phase: 'seed',
    status: 'active',
    }).returning()

    revalidatePath('/dashboard')

    redirect(`/journey/${newJourney.id}`);
       
}
