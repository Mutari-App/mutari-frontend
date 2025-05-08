import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { customFetch, customFetchBody } from '@/utils/newCustomFetch'
import { FormProps } from '../interface'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { changePasswordSchema } from '../schemas/changePasswordSchema'

export const ChangePasswordForm: React.FC<FormProps> = ({ closeDialog }) => {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const changePasswordForm = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const handleChangePasswordSubmit = async (
    values: z.infer<typeof changePasswordSchema>
  ) => {
    setSubmitLoading(true)
    const {
      formState: { errors },
    } = changePasswordForm

    if (!Object.keys(errors).length) {
      try {
        const response = await customFetch('/profile/password', {
          method: 'PATCH',
          body: customFetchBody({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          }),
        })

        if (response.statusCode === 200) {
          toast.success('Password berhasil diubah!')
          closeDialog()
          return
        }
        throw new Error(response.message)
      } catch (err: any) {
        if (err instanceof Error) {
          if (err.message.includes('Old password is incorrect')) {
            changePasswordForm.setError('oldPassword', {
              type: 'manual',
              message: 'Password lama tidak sesuai',
            })
          } else if (
            err.message.includes('New password and confirmation do not match')
          ) {
            changePasswordForm.setError('confirmPassword', {
              type: 'manual',
              message: 'Password baru dan konfirmasi tidak sesuai',
            })
          } else if (
            err.message.includes('New password cannot be the same as old')
          ) {
            changePasswordForm.setError('newPassword', {
              type: 'manual',
              message: 'Password baru tidak boleh sama dengan password lama',
            })
          } else {
            toast.error('Terjadi kesalahan. Silakan coba lagi.')
          }
        } else {
          toast.error('Terjadi kesalahan. Silakan coba lagi.')
        }
      } finally {
        setSubmitLoading(false)
      }
    }
  }

  return (
    <Form {...changePasswordForm}>
      <form
        name="changePasswordForm"
        onSubmit={changePasswordForm.handleSubmit(handleChangePasswordSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4">
          <FormField
            control={changePasswordForm.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Password Lama</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Masukkan password lama"
                    {...field}
                    className="placeholder:text-[#94A3B8] text-base border-[#0073E6] border-2 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-xs -mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={changePasswordForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Password Baru</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Masukkan password baru"
                    {...field}
                    className="placeholder:text-[#94A3B8] text-base border-[#0073E6] border-2 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-xs -mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={changePasswordForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">
                  Konfirmasi Password Baru
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Konfirmasi password baru"
                    {...field}
                    className="placeholder:text-[#94A3B8] text-base border-[#0073E6] border-2 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-xs -mt-1" />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2 mt-4">
          <Button
            disabled={submitLoading}
            type="submit"
            name="submit-button"
            className="bg-gradient-to-br from-[#0073E6] to-[#004080] rounded-lg hover:bg-[#0059B3]/90 text-white w-full font-normal"
          >
            {submitLoading ? <Loader className="animate-spin" /> : 'Simpan'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
