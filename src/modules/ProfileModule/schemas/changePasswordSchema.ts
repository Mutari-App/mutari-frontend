import { z } from 'zod'

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, { message: 'Password lama harus diisi' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password baru minimal 8 karakter' })
      .regex(/^(?=.*[A-Z]).*$/, {
        message: 'Password harus memiliki minimal satu huruf besar',
      })
      .regex(/^(?=.*\d).*$/, {
        message: 'Password harus memiliki minimal satu angka',
      }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Konfirmasi password harus diisi' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password baru dan konfirmasi password tidak cocok',
    path: ['confirmNewPassword'],
  })
