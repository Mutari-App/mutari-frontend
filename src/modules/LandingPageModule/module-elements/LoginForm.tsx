'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { type LoginFormProps } from '../interface'
import { customFetch, customFetchBody } from '@/utils/customFetch'
import { useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Masukkan email yang valid'),
})

export const LoginForm: React.FC<LoginFormProps> = ({
  isSuccess,
  setIsSuccess,
  showRegisterForm,
  email,
  setEmail,
}) => {
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    console.log('Form Data:', values)
    setLoading(true)
    try {
      const response = await customFetch('/pre-register/login', {
        method: 'POST',
        body: customFetchBody({ email: values.email }),
      })

      if (response.statusCode !== 200) throw new Error(response.message)

      setEmail(values.email)
      setIsSuccess(true)
      toast.success('Login berhasil!', {
        description: 'Silahkan cek email anda!',
      })
    } catch (err: any) {
      toast.error(`${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return isSuccess ? (
    <div className="relative  rounded-2xl p-8 text-center text-white shadow-xl text-center  ">
      <CheckCircle className="mx-auto h-16 w-16 text-green-400 mb-6" />
      <h2 className="text-2xl font-bold mb-6">Login Berhasil!</h2>
      <div className="space-y-4 mb-8">
        <p className="text-sm sm:text-base md:text-lg">
          Silahkan cek email <strong>{email}</strong> untuk informasi login.
        </p>
      </div>
    </div>
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative  grid grid-cols-1 gap-y-6 "
      >
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Masukkan alamat email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="col-span-2 flex justify-center">
          <Button disabled={loading} variant={'secondary'} type="submit">
            Login
          </Button>
        </div>

        {/* Login Link */}
        <div className="col-span-2 flex justify-center text-xs gap-1">
          <span className="">Belum punya akun?</span>
          <button
            onClick={showRegisterForm}
            className="underline font-semibold"
          >
            Register di sini
          </button>
        </div>
      </form>
    </Form>
  )
}
