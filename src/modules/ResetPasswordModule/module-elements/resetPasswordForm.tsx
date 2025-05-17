'use client'

import { useForm } from 'react-hook-form'
import { useResetPasswordContext } from '../contexts/ResetPasswordContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { type z } from 'zod'
import { useEffect, useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { resetPasswordFormSchema } from '../schemas/resetPasswordFormSchema'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'
import { customFetch, customFetchBody } from '@/utils/customFetch'
import { toast } from 'sonner'

export const ResetPasswordForm: React.FC = () => {
  const router = useRouter()
  const {
    resetPasswordData: { email, uniqueCode, password, confirmPassword },
    setResetPasswordData,
  } = useResetPasswordContext()

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
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
    setSubmitLoading(false)
  }

  const submitResetPasswordForm = async (
    values: z.infer<typeof resetPasswordFormSchema>
  ) => {
    setSubmitLoading(true)
    const {
      formState: { errors },
    } = form

    if (!Object.keys(errors).length) {
      setResetPasswordData((prevValue) => ({
        ...prevValue,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }))
    }

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
        toast.success('Password baru berhasil disimpan!')
        setSubmitLoading(false)
        router.push('/login')
        trackUmami('reset_password_success', { email })
      } else {
        handleResponseError()
      }
    } catch (error: any) {
      if (error instanceof Error) {
        handleResponseError()
      }
    }
  }

  useEffect(() => {
    form.reset({
      password,
      confirmPassword,
    })
  }, [password, confirmPassword, form])

  return (
    <Form {...form}>
      <form
        name="resetPasswordForm"
        onSubmit={form.handleSubmit(submitResetPasswordForm)}
        className="w-[65%]"
      >
        <div className="flex flex-col md:gap-8 text-[#024C98] w-[100%]">
          <div className="flex flex-col gap-5 text-center font-semibold">
            <h1 className="text-4xl">Buat Password</h1>
            <span className="text-xl font-raleway">
              Jangan lupakan passwordmu!
            </span>
          </div>

          <div className="font-medium space-y-5 w-full">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Password*</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="placeholder:text-[#94A3B8] text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Konfirmasi Password</FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Konfirmasi Password"
                      {...field}
                      className="placeholder:text-[#94A3B8] text-base w-[100%]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center">
              <Button
                disabled={submitLoading}
                type="submit"
                className="bg-[#0059B3] hover:bg-[#0059B3]/90 text-white w-full"
              >
                {submitLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  'Simpan password baru'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
