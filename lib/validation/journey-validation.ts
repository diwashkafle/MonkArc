import { z } from 'zod'

// SHARED FIELDS

const baseJourneySchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(500, 'Title must be less than 500 characters')
    .trim(),
  
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .trim(),
  
  targetCheckIns: z
    .number()
    .int('Must be a whole number')
    .min(7, 'Minimum 7 check-ins required')
    .max(365, 'Maximum 365 check-ins allowed'),
  
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  
  isPublic: z.boolean().default(false),
})

// LEARNING JOURNEY SCHEMA

export const learningJourneySchema = baseJourneySchema.extend({
  coreResource: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')), // Allow empty string
})

export type LearningJourneyInput = z.infer<typeof learningJourneySchema>

// PROJECT JOURNEY SCHEMA

export const projectJourneySchema = baseJourneySchema.extend({
  deliverable: z
    .string()
    .min(10, 'Deliverable must be at least 10 characters')
    .max(2000, 'Deliverable must be less than 2000 characters')
    .trim(),
  
  repoURL: z
    .string()
    .url('Must be a valid URL')
    .refine(
      (url) => url.includes('github.com'),
      'Must be a GitHub repository URL'
    ),
  
  techStack: z
    .array(z.string())
    .max(10, 'Maximum 10 technologies')
    .optional()
    .default([]),
})

export type ProjectJourneyInput = z.infer<typeof projectJourneySchema>

// EDIT JOURNEY SCHEMA (Can't change immutable fields)

export const editJourneySchema = z.object({
  title: z.string().min(3).max(500).trim(),
  description: z.string().min(10).max(2000).trim(),
  isPublic: z.boolean(),
  
  // Learning-specific
  coreResource: z.string().url().optional().or(z.literal('')),
  
  // Project-specific
  deliverable: z.string().min(10).max(2000).trim().optional(),
  repoURL: z.string().url().optional(),
  techStack: z.array(z.string()).max(10).optional(),
})

export type EditJourneyInput = z.infer<typeof editJourneySchema>