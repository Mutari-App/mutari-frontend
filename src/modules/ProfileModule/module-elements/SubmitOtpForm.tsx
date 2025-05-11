import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { SubmitOtpFormProps } from '../interface'
import { z } from 'zod'
import { customFetch, customFetchBody } from '@/utils/newCustomFetch'
import { toast } from 'sonner'
import { otpFormSchema } from '../schemas/otpFormSchema'

export const SubmitOtpForm: React.FC<SubmitOtpFormProps> = ({
  closeDialog,
  backButtonHandler,
  newEmail,
}) => {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
    },
  })

  const handleOtpSubmit = async (values: z.infer<typeof otpFormSchema>) => {
    setSubmitLoading(true)

    try {
      const response = await customFetch('/profile/email/change-verification', {
        method: 'POST',
        body: customFetchBody({
          code: values.otp,
        }),
      })

      if (response.statusCode === 200) {
        toast.success('Email berhasil diubah')
        closeDialog()
      } else {
        toast.error(response.message)
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      } else {
        toast.error('Terjadi kesalahan, silakan coba lagi')
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <Form {...otpForm}>
      <form
        name="otpForm"
        onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2 h-[5.5rem]">
          <FormField
            control={otpForm.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-sm">Kode OTP</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Masukkan kode OTP"
                    {...field}
                    className={'border-[#0073E6] border-2 rounded-lg'}
                  />
                </FormControl>
                <FormMessage className="text-xs " />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-start text-[#2FA9F4]">
          <button
            type="button"
            onClick={backButtonHandler}
            className="flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Kembali</span>
          </button>
        </div>
        <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2 ">
          <Button
            disabled={submitLoading}
            type="submit"
            name="submit-button"
            className="bg-gradient-to-br from-[#0073E6] to-[#004080] rounded-lg hover:bg-[#0059B3]/90 text-white w-full font-normal"
          >
            {submitLoading ? (
              <Loader className="animate-spin" />
            ) : (
              'Verifikasi Email'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
