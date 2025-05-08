import { z } from 'zod'

export const updateProfileFormSchema = z.object({
  firstName: z
    .string()
    .max(150, { message: 'Nama tidak boleh melebihi 150 karakter.' })
    .min(1, 'Nama depan wajib diisi.'),
  lastName: z.string(),
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
    .superRefine((data, ctx) => {
      if (!data.day || !data.month || !data.year) return

      const { day, month, year } = data
      const date = new Date(year, month - 1, day)

      if (date.getDate() !== day || date.getMonth() !== month - 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tanggal lahir tidak valid.',
          path: ['day'],
        })
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Bulan lahir tidak valid.',
          path: ['month'],
        })
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tahun lahir tidak valid.',
          path: ['year'],
        })
      }

      if (date > new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tanggal lahir tidak boleh di masa depan.',
          path: ['day'],
        })
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tanggal lahir tidak boleh di masa depan.',
          path: ['month'],
        })
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tanggal lahir tidak boleh di masa depan.',
          path: ['year'],
        })
      }
    })
    .optional(),
})
