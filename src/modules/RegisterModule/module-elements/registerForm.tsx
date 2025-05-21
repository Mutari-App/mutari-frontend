'use client'

import { useForm } from 'react-hook-form'
import { useRegisterContext } from '../contexts/RegisterContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { type z } from 'zod'
import { useEffect, useState } from 'react'
import { registerFormSchema } from '../schemas/registerFormSchema'
import { useRouter } from 'next/navigation'
import { customFetch, customFetchBody } from '@/utils/customFetch'
import { toast } from 'sonner'
import { RegisterPasswordElement } from './registerPasswordFormElement'

export const RegisterForm: React.FC = () => {
  const router = useRouter()
  const {
    registerData: {
      firstName,
      lastName,
      email,
      birthDate,
      uniqueCode,
      password,
      confirmPassword,
    },
    setRegisterData,
  } = useRegisterContext()

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      password,
      confirmPassword,
    },
  })

  const submitRegisterForm = async (
    values: z.infer<typeof registerFormSchema>
  ) => {
    setSubmitLoading(true)
    const {
      formState: { errors },
    } = form

    if (!Object.keys(errors).length) {
      setRegisterData((prevValue) => {
        return {
          ...prevValue,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }
      })
    }

    try {
      const response = await customFetch('/auth/register', {
        method: 'POST',
        body: customFetchBody({
          firstName,
          lastName,
          email,
          birthDate,
          verificationCode: uniqueCode,
          password: values.password,
          confirmPassword: values.confirmPassword,
        }),
      })

      if (response.statusCode == 200) {
        toast.success('Password berhasil disimpan!')
        setSubmitLoading(false)
        router.push('/login')

        if (typeof window !== 'undefined' && window.umami) {
          window.umami.track('register_success', {
            email: email,
          })
        }
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
        if (typeof window !== 'undefined' && window.umami) {
          window.umami.track('register_fail')
        }
        setSubmitLoading(false)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
      if (typeof window !== 'undefined' && window.umami) {
        window.umami.track('register_fail')
      }
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    form.reset({
      password,
      confirmPassword,
    })
  }, [password, confirmPassword, form])

  const [submitLoading, setSubmitLoading] = useState(false)

  return RegisterPasswordElement({
    form,
    submitRegisterForm,
    submitLoading,
  })
}
