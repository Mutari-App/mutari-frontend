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
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { codeVerificationFormSchema } from '../schemas/codeVerificationFormSchema'
import { customFetch, customFetchBody } from '@/utils/customFetch'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'

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
        toast.success('Verifikasi kode berhasil!')
        setSubmitLoading(false)
        goToNextPage()
        return
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
        setSubmitLoading(false)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
        setSubmitLoading(false)
      }
    }
  }

  useEffect(() => {
    form.reset({ uniqueCode })
  }, [form, uniqueCode])

  const [submitLoading, setSubmitLoading] = useState(false)

  return (
    <Form {...form}>
      <form
        name="codeVerificationForm"
        onSubmit={form.handleSubmit(submitCodeVerificationForm)}
      >
        <div className="flex flex-col gap-8 text-[#024C98]">
          <div className="flex flex-col gap-5 text-center font-semibold px-[10%]">
            <h1 className="text-4xl">Masukkan Kode Verifikasi</h1>
            <span className="text-xl font-raleway">
              Kami mengirim kode verifikasi ke email {email}
            </span>
          </div>

          <div className="font-medium space-y-5 px-[20%]">
            <FormField
              control={form.control}
              name="uniqueCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Kode Verifikasi"
                      {...field}
                      className="placeholder:text-[#94A3B8] text-base"
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
                  'Verifikasi'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
