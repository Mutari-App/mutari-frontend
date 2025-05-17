import { z } from 'zod'

export const codeVerificationFormSchema = z.object({
  uniqueCode: z
    .string()
    .max(8, 'Unique Code must be 8 characters.')
    .min(8, 'Unique Code must be 8 characters.'),
})
