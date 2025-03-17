import { z } from 'zod'

export const createUserFormSchema = z.object({
  firstName: z
    .string()
    .max(150, { message: 'Nama tidak boleh melebihi 150 karakter.' })
    .min(1, 'Nama depan wajib diisi.'),
  lastName: z.string(),
  email: z
    .string()
    .min(1, { message: 'Email wajib diisi.' })
    .email('Email invalid.'),
  birthDate: z
    .object({
      day: z.coerce
        .number()
        .min(1, { message: 'Tanggal invalid.' })
        .max(31, { message: 'Tanggal invalid.' })
        .optional(),
      month: z.coerce
        .number()
        .min(1, { message: 'Bulan invalid.' })
        .max(12, { message: 'Bulan invalid.' })
        .optional(),
      year: z.coerce
        .number()
        .min(1900, { message: 'Tahun invalid.' })
        .max(
          new Date().getFullYear(),
          'Tanggal lahir tidak boleh di masa depan.'
        )
        .optional(),
    })
    .optional(),
})
