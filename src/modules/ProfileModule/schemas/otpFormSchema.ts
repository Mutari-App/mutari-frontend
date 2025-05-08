import { z } from 'zod'

export const otpFormSchema = z.object({
  otp: z.string().length(8, 'Kode OTP harus 8 digit!'),
})
