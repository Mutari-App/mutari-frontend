'use client'

import { useForm } from 'react-hook-form'
import { useResetPasswordContext } from '../contexts/ResetPasswordContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { type z } from 'zod'
import { useEffect, useState } from 'react'
import { registerFormSchema } from '@/modules/RegisterModule/schemas/registerFormSchema'
import { useRouter } from 'next/navigation'
import { customFetch, customFetchBody } from '@/utils/newCustomFetch'
import { toast } from 'sonner'
import { RegisterPasswordElement } from '@/modules/RegisterModule/module-elements/registerPasswordFormElement'

export const ResetPasswordForm: React.FC = () => {
  const router = useRouter()
  const {
    resetPasswordData: { email, uniqueCode, password, confirmPassword },
    setResetPasswordData,
  } = useResetPasswordContext()

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      password,
      confirmPassword,
    },
  })

  const [submitLoading, setSubmitLoading] = useState(false)

  const trackUmami = (event: string, data?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track(event, data)
    }
  }

  const handleResponseError = () => {
    toast.error('Terjadi kesalahan. Silakan coba lagi.')
    trackUmami('reset_password_fail')
  }

  const submitResetPasswordForm = async (
    values: z.infer<typeof registerFormSchema>
  ) => {
    setSubmitLoading(true)
    const {
      formState: { errors },
    } = form

    if (Object.keys(errors).length) return

    try {
      const response = await customFetch('/auth/resetPassword', {
        method: 'POST',
        body: customFetchBody({
          email,
          verificationCode: uniqueCode,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      })

      if (response.statusCode == 200) {
        setResetPasswordData((prevValue) => ({
          ...prevValue,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }))
        toast.success('Password baru berhasil disimpan!')
        router.push('/login')
        trackUmami('reset_password_success', { email })
      } else {
        handleResponseError()
      }
    } catch (error: any) {
      if (error instanceof Error) {
        handleResponseError()
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    form.reset({
      password,
      confirmPassword,
    })
  }, [password, confirmPassword, form])

  return RegisterPasswordElement({
    form,
    submitRegisterForm: submitResetPasswordForm,
    submitLoading,
  })
}
