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
import { changeEmailFormSchema } from '../schemas/changeEmailSchema'
import { type ChangeEmailFormProps } from '../interface'
import { useAuthContext } from '@/contexts/AuthContext'
import { type z } from 'zod'
import { customFetch, customFetchBody } from '@/utils/newCustomFetch'
import { toast } from 'sonner'

export const ChangeEmailForm: React.FC<ChangeEmailFormProps> = ({
  setNewEmail,
  enableSubmitOtpMode,
  editProfileButtonHandler,
}) => {
  const { user } = useAuthContext()

  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const changeEmailForm = useForm<z.infer<typeof changeEmailFormSchema>>({
    resolver: zodResolver(changeEmailFormSchema),
    defaultValues: {
      email: user?.email,
    },
  })

  const handleChangeEmailSubmit = async (
    values: z.infer<typeof changeEmailFormSchema>
  ) => {
    setSubmitLoading(true)

    try {
      const response = await customFetch('/profile/email/request-change', {
        method: 'POST',
        body: customFetchBody({
          email: values.email,
        }),
      })

      if (response.statusCode === 200) {
        setNewEmail(values.email)
        enableSubmitOtpMode()
        toast.success('Kode verifikasi telah dikirim ke email baru')
      } else {
        toast.error(response.message)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Terjadi kesalahan, silakan coba lagi')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <Form {...changeEmailForm}>
      <form
        name="changeEmailForm"
        onSubmit={changeEmailForm.handleSubmit(handleChangeEmailSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2 h-[6rem] ">
          <FormField
            control={changeEmailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-sm">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Masukkan email baru"
                    {...field}
                    value={field.value ?? ''}
                    className={'border-[#0073E6] border-2 rounded-lg'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-start text-[#2FA9F4]">
          <button
            type="button"
            onClick={editProfileButtonHandler}
            className="flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Ubah Profil </span>{' '}
          </button>
        </div>
        <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2 ">
          <Button
            disabled={
              submitLoading ||
              user?.email === changeEmailForm.getValues('email')
            }
            type="submit"
            name="submit-button"
            className="bg-gradient-to-br from-[#0073E6] to-[#004080] rounded-lg hover:bg-[#0059B3]/90 text-white w-full  font-normal"
          >
            {submitLoading ? (
              <Loader className="animate-spin" />
            ) : (
              'Kirim Verifikasi'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
