import { useForm } from 'react-hook-form'
import { useResetPasswordContext } from '../contexts/ResetPasswordContext'
import { requestPasswordResetFormSchema } from '../schemas/requestPasswordResetFormSchema'
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
import { customFetch, customFetchBody } from '@/utils/customFetch'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'

export const RequestPasswordResetForm: React.FC = () => {
  const {
    goToNextPage,
    resetPasswordData: { email },
    setResetPasswordData,
  } = useResetPasswordContext()

  const form = useForm<z.infer<typeof requestPasswordResetFormSchema>>({
    resolver: zodResolver(requestPasswordResetFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const submitRequestPasswordResetForm = async (
    values: z.infer<typeof requestPasswordResetFormSchema>
  ) => {
    setSubmitLoading(true)
    const {
      formState: { errors },
    } = form

    if (Object.keys(errors).length) return

    try {
      const response = await customFetch('/auth/requestPasswordReset', {
        method: 'POST',
        body: customFetchBody({
          email: values.email,
        }),
      })

      if (response.statusCode === 200) {
        setResetPasswordData((prevValue) => {
          return {
            ...prevValue,
            email: values.email,
          }
        })
        toast.success('Kode verifikasi dikirim! Silakan cek email Anda.')
        goToNextPage()
      } else if (response.statusCode === 400) {
        toast.error('Email tidak valid atau tidak terverifikasi!')
      } else {
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    form.reset({
      email,
    })
  }, [email, form])

  const [submitLoading, setSubmitLoading] = useState(false)

  return (
    <Form {...form}>
      <form
        name="requestPasswordResetForm"
        onSubmit={form.handleSubmit(submitRequestPasswordResetForm)}
      >
        <div className="flex flex-col gap-5 md:gap-8 text-[#024C98]">
          <div className="flex flex-col gap-5 text-center font-semibold">
            <h1 className="text-4xl">Lupa Password</h1>
            <span className="text-xl font-raleway">
              Masukan email untuk mengganti password
            </span>
          </div>

          <div className="font-medium space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Email*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan email"
                      {...field}
                      className="placeholder:text-[#94A3B8] text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-center">
            <Button
              disabled={submitLoading}
              type="submit"
              name="submit-button"
              className="bg-[#0059B3] hover:bg-[#0059B3]/90 text-white w-full"
            >
              {submitLoading ? (
                <Loader className="animate-spin" />
              ) : (
                'Kirim password reset email'
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
