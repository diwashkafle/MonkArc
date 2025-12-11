import { z } from 'zod'

// ========================================
// SHARED BASE SCHEMA
// ========================================

const baseJourneySchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(500, 'Title must be less than 500 characters')
    .trim(),
  
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .trim(),
  
  type: z.enum(["learning", "project"], {
    message: "Invalid type"
  }),
  
  targetCheckIns: z
    .number()
    .int('Must be a whole number')
    .min(7, 'Minimum 7 check-ins required')
    .max(365, 'Maximum 365 check-ins allowed'),
  
  isPublic: z.boolean().default(true),
})

// ========================================
// RESOURCE SCHEMA
// ========================================

export const resourceSchema = z.object({
  id: z.string(),
  url: z.string().url('Must be a valid URL'),
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['video', 'article', 'docs', 'other', 'course', 'book']),
  addedAt: z.string(),
})

export type Resource = z.infer<typeof resourceSchema>

// ========================================
// UNIFIED JOURNEY CREATION SCHEMA
// ========================================

export const createJourneySchema = baseJourneySchema.extend({
  // Start Date
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  
  // Learning resources (optional)
  resources: z.array(resourceSchema)
  .optional()
  .default([])
  .transform((resources) => {
    // Filter out any invalid resources (empty URLs, etc.)
      return resources.filter((r) => {
        try {
          new URL(r.url)
          return true
        } catch {
          return false
        }
      })
  }),
  
  // ✅ FIXED: Repo URL - handle empty string and null properly
  repoURL: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      // Convert empty string to null
      if (!val || val.trim() === '') return null
      return val
    })
    .refine(
      (url) => {
        if (!url) return true // null/empty is valid
        // Validate URL format
        try {
          new URL(url)
          return url.includes('github.com')
        } catch {
          return false
        }
      },
      'Must be a valid GitHub repository URL'
    ),
  
  // ✅ FIXED: Tech Stack - accept ARRAY not string
  techStack: z
    .array(z.string())
    .optional()
    .default([]),
})

export type CreateJourneyInput = z.infer<typeof createJourneySchema>

// ========================================
// EDIT JOURNEY SCHEMA
// ========================================

export const editJourneySchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(500, 'Title must be less than 500 characters')
    .trim(),
  
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 5000 characters')
    .trim(),
  
  isPublic: z.boolean(),
  
  // Resources
  resources: z.array(resourceSchema).optional().default([]).transform((resources) => {
      // Filter out any invalid resources (empty URLs, etc.)
      return resources.filter((r) => {
        try {
          new URL(r.url)
          return true
        } catch {
          return false
        }
      })
    }),
  
  // Repo URL
  repoURL: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === '') return null
      return val
    })
    .refine(
      (url) => {
        if (!url) return true
        try {
          new URL(url)
          return url.includes('github.com')
        } catch {
          return false
        }
      },
      'Must be a valid GitHub repository URL'
    ),
  
  // Tech Stack
  techStack: z
    .array(z.string())
    .optional()
    .default([]),
})

export type EditJourneyInput = z.infer<typeof editJourneySchema>

// ========================================
// HELPER: VALIDATE JOURNEY TYPE
// ========================================

export function validateJourneyByType(data: CreateJourneyInput) {
  if (data.type === 'project') {
    if (!data.repoURL) {
      console.warn('Project journey created without GitHub repo URL')
    }
  }
  return true
}