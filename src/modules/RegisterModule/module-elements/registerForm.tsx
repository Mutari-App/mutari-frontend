'use client'

import { useForm } from 'react-hook-form'
import { useRegisterContext } from '../contexts/RegisterContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { registerFormSchema } from '../schemas/registerFormSchema'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'
import { customFetch, customFetchBody } from '@/utils/customFetch'
import { toast } from 'sonner'

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
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
        setSubmitLoading(false)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    form.reset({
      password,
      confirmPassword,
    })
  }, [password, confirmPassword])

  const [submitLoading, setSubmitLoading] = useState(false)

  return (
    <Form {...form}>
      <form
        name="registerForm"
        onSubmit={form.handleSubmit(submitRegisterForm)}
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
                  'Simpan password'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
