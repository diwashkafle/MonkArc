import { z } from 'zod'

export const checkInSchema = z.object({
  journeyId: z.string().min(1, 'Journey ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  accomplishment: z
    .string()
    .min(10, 'Please write at least 10 characters')
    .max(500, 'Maximum 500 characters'),
  notes: z
    .string()
    .max(2000, 'Maximum 2000 characters')
    .optional()
    .or(z.literal('')),
})

export type CheckInInput = z.infer<typeof checkInSchema>