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

import {
  type PreRegisterResponse,
  type PreRegisterFormProps,
} from '../interface'
import { customFetch, customFetchBody } from '@/utils/customFetch'
import { toast } from 'sonner'
import { useState } from 'react'
import { CheckCircle, Loader } from 'lucide-react'

const preRegisterSchema = z.object({
  firstName: z.string().min(2, 'Nama depan minimal 2 karakter'),
  lastName: z.string().optional(),
  email: z.string().email('Masukkan email yang valid'),
  phoneNumber: z.string().min(8, 'Nomor telepon tidak valid'),
  referralCode: z.string().optional(),
})

export const PreRegisterForm: React.FC<PreRegisterFormProps> = ({
  isSuccess,
  setIsSuccess,
  showLoginForm,
  email,
  setEmail,
}) => {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const form = useForm({
    resolver: zodResolver(preRegisterSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      referralCode: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof preRegisterSchema>) => {
    try {
      setSubmitLoading(true)
      const normalizedPhoneNumber = values.phoneNumber.startsWith('0')
        ? values.phoneNumber.slice(1)
        : values.phoneNumber

      const response = await customFetch<PreRegisterResponse>('/pre-register', {
        method: 'POST',
        body: customFetchBody({
          ...values,
          phoneNumber: normalizedPhoneNumber,
          referralCode:
            values.referralCode?.length !== 0 ? values.referralCode : null,
        }),
      })

      if (response.statusCode !== 200) throw new Error(response.message)
      setEmail(values.email)
      setIsSuccess(true)
      toast.success('Praregistrasi berhasil!', {
        description: 'Silahkan cek email anda!',
      })
    } catch (err) {
      if (err instanceof Error) toast.error(`${err.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  return isSuccess ? (
    <div className="relative  rounded-2xl p-8 text-center text-white shadow-xl  ">
      <CheckCircle className="mx-auto h-16 w-16 text-green-400 mb-6" />
      <h2 className="text-2xl font-bold mb-6">Praregistrasi Berhasil!</h2>
      <div className="space-y-4 mb-8">
        <p className="text-lg">
          Silahkan cek email <strong>{email}</strong> untuk informasi login.
        </p>
        <p className="text-lg">
          Setelah login, Anda akan mendapatkan <strong>kode referral</strong>.
          Bagikan kode referral dan dapatkan <strong>hadiah menarik</strong>!
        </p>
      </div>
      <Button onClick={showLoginForm} variant={'secondary'} className="w-full">
        Login
      </Button>
    </div>
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative grid grid-cols-1 md:grid-cols-2 gap-y-3 sm:gap-y-6 gap-x-3"
      >
        {/* Nama Depan */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
              <FormLabel>Nama Depan*</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama depan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nama Akhir */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
              <FormLabel>Nama Akhir</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama akhir" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
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

        {/* No. HP */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
              <FormLabel>No. HP*</FormLabel>
              <FormControl>
                <Input
                  prefix="+62"
                  type="number"
                  placeholder="Masukkan nomor telepon"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Kode Referal */}
        <FormField
          control={form.control}
          name="referralCode"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Kode Referal</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Masukkan kode referal (opsional)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="col-span-2 flex justify-center">
          <Button disabled={submitLoading} variant={'secondary'} type="submit">
            {submitLoading ? (
              <Loader className="animate-spin" />
            ) : (
              'Praregistrasi'
            )}
          </Button>
        </div>

        {/* Login Link */}
        <div className="col-span-2 flex justify-center text-xs gap-1">
          <span className="">Sudah punya akun?</span>
          <button onClick={showLoginForm} className="underline font-semibold">
            Login di sini
          </button>
        </div>
      </form>
    </Form>
  )
}
