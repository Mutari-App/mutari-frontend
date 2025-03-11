'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuthContext } from '@/contexts/AuthContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
})

export const LoginForm = () => {
  const { login } = useAuthContext()
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    console.log('Login values:', values)
    try {
      setLoading(true)
      const response = await login(values)
      console.log(response)
      router.push('/')
      toast.success('Berhasil login!')
    } catch (err: any) {
      toast.error((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        name="loginForm"
        className="w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex w-full max-w-sm mx-auto  flex-col md:gap-8 text-[#024C98]">
          <div className="flex flex-col gap-5 text-center font-semibold">
            <h1 className="text-4xl">Masuk</h1>
          </div>

          <div className="font-medium space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Masukkan email"
                      className="placeholder:text-[#94A3B8] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Masukkan password"
                      className="placeholder:text-[#94A3B8] text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center">
            <Button
              disabled={loading}
              type="submit"
              name="submit-button"
              className="bg-[#0059B3] hover:bg-[#0059B3]/90 text-white w-full"
            >
              Masuk
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
