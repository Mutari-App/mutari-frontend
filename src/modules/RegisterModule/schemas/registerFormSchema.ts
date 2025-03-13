import { z } from 'zod'

export const registerFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/^(?=.*[A-Z]).*$/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/^(?=.*\d).*$/, {
        message: 'Password must contain at least one number',
      }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/^(?=.*[A-Z]).*$/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/^(?=.*\d).*$/, {
        message: 'Password must contain at least one number',
      }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
