'use client'

import { useForm } from 'react-hook-form'
import { useRegisterContext } from '../contexts/RegisterContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { type z } from 'zod'
import { useEffect, useState } from 'react'
import { codeVerificationFormSchema } from '../schemas/codeVerificationFormSchema'
import { customFetch, customFetchBody } from '@/utils/customFetch'
import { toast } from 'sonner'
import { CodeVerificationFormElement } from './codeVerificationFormElement'

export const CodeVerificationForm: React.FC = () => {
  const {
    goToNextPage,
    registerData: { firstName, lastName, email, birthDate, uniqueCode },
    setRegisterData,
  } = useRegisterContext()

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

    if (!Object.keys(errors).length) {
      setRegisterData((prevValue) => {
        return {
          ...prevValue,
          uniqueCode: values.uniqueCode,
        }
      })
    }

    try {
      const response = await customFetch('/auth/verify', {
        method: 'POST',
        body: customFetchBody({
          firstName,
          lastName,
          email,
          birthDate,
          verificationCode: values.uniqueCode,
        }),
      })

      if (response.statusCode === 200) {
        toast.success('Verifikasi kode berhasil!')
        setSubmitLoading(false)
        goToNextPage()
        return
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
        setSubmitLoading(false)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
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
