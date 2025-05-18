'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useAuthContext } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
})

export const LoginForm = () => {
  const { login } = useAuthContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [redirectPath, setRedirectPath] = useState<string>('/')

  useEffect(() => {
    const redirect = searchParams.get('redirect')
    if (redirect) {
      setRedirectPath(redirect)
    }
  }, [searchParams])

  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true)
      await login(values)
      router.push(redirectPath)
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
        <div className="flex w-full max-w-sm mx-auto  flex-col gap-4 md:gap-8 text-[#024C98]">
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
                  <span className="text-sm text-center text-[#64748B]">
                    <Link href="/password-reset" className="underline">
                      Lupa password?
                    </Link>
                  </span>
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
          <span className="text-sm text-center text-[#024C98] font-medium">
            Belum punya akun?{' '}
            <Link href="/register" className="underline">
              Daftar di sini
            </Link>
          </span>
        </div>
      </form>
    </Form>
  )
}
