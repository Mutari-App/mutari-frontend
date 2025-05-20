import { z } from 'zod'

export const requestPasswordResetFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email wajib diisi.' })
    .email('Email invalid.'),
})
