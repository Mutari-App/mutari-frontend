'use client'

import { useForm } from 'react-hook-form'
import { useResetPasswordContext } from '../contexts/ResetPasswordContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { type z } from 'zod'
import { useEffect, useState } from 'react'
import { codeVerificationFormSchema } from '@/modules/RegisterModule/schemas/codeVerificationFormSchema'
import { customFetch, customFetchBody } from '@/utils/newCustomFetch'
import { toast } from 'sonner'
import { CodeVerificationFormElement } from '@/modules/RegisterModule/module-elements/codeVerificationFormElement'

export const CodeVerificationForm: React.FC = () => {
  const {
    goToNextPage,
    resetPasswordData: { email, uniqueCode },
    setResetPasswordData,
  } = useResetPasswordContext()

  const form = useForm<z.infer<typeof codeVerificationFormSchema>>({
    resolver: zodResolver(codeVerificationFormSchema),
    defaultValues: {
      uniqueCode,
    },
  })

  const submitCodeVerificationForm = async (
    values: z.infer<typeof codeVerificationFormSchema>
  ) => {
    setSubmitLoading(true)

    const {
      formState: { errors },
    } = form

    if (Object.keys(errors).length) return

    try {
      const response = await customFetch('/auth/verifyPasswordReset', {
        method: 'POST',
        body: customFetchBody({
          email,
          verificationCode: values.uniqueCode,
        }),
      })

      if (response.statusCode === 200) {
        setResetPasswordData((prevValue) => {
          return {
            ...prevValue,
            uniqueCode: values.uniqueCode,
          }
        })
        toast.success('Verifikasi kode berhasil!')
        goToNextPage()
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    form.reset({ uniqueCode })
  }, [form, uniqueCode])

  const [submitLoading, setSubmitLoading] = useState(false)

  return CodeVerificationFormElement({
    form,
    submitCodeVerificationForm,
    email,
    submitLoading,
  })
}
