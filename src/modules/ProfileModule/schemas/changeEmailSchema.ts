import { z } from 'zod'

export const changeEmailFormSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
})
