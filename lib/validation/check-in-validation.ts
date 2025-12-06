import { z } from 'zod'

export const checkInSchema = z.object({
  journeyId: z.string().uuid(),
  
  journal: z
    .string()
    .min(50, 'Journal entry must be at least 50 characters')
    .max(5000, 'Journal entry must be less than 5000 characters')
    .trim(),
  
  promptUsed: z
    .string()
    .min(1, 'Prompt is required')
    .max(500),
  
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
})

export type CheckInInput = z.infer<typeof checkInSchema>