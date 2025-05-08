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
import { Google } from '@/icons/Google'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Loader } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { updateProfileFormSchema } from '../schemas/updateProfileSchema'
import { useAuthContext } from '@/contexts/AuthContext'
import { z } from 'zod'
import { toast } from 'sonner'
import { customFetch, customFetchBody } from '@/utils/newCustomFetch'
import { EditProfileFormProps } from '../interface'
import { useRouter } from 'next/navigation'

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  closeDialog,
  changeEmailButtonHandler,
}) => {
  const { user, getMe } = useAuthContext()
  const router = useRouter()
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const updateProfileForm = useForm<z.infer<typeof updateProfileFormSchema>>({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      birthDate: (() => {
        if (!user?.birthDate) {
          return {
            day: undefined,
            month: undefined,
            year: undefined,
          }
        }

        const birthDate = new Date(user.birthDate)
        return {
          day: birthDate.getDate(),
          month: birthDate.getMonth() + 1, // getMonth() returns 0-11
          year: birthDate.getFullYear(),
        }
      })(),
    },
  })

  const handleUpdateProfileSubmit = async (
    values: z.infer<typeof updateProfileFormSchema>
  ) => {
    setSubmitLoading(true)
    const {
      formState: { errors },
    } = updateProfileForm

    const parseBirthdate: Date | undefined =
      values.birthDate?.year !== undefined &&
      values.birthDate?.month !== undefined &&
      values.birthDate?.day !== undefined
        ? new Date(
            values.birthDate.year,
            values.birthDate.month - 1,
            values.birthDate.day
          )
        : undefined

    if (!Object.keys(errors).length) {
      try {
        const response = await customFetch('/profile/', {
          method: 'PATCH',
          body: customFetchBody({
            firstName: values.firstName,
            lastName: values.lastName,
            birthDate: parseBirthdate
              ? parseBirthdate.toISOString()
              : undefined,
          }),
        })

        if (response.statusCode === 200) {
          toast.success('Profil berhasil diubah!')
          await getMe()
          router.refresh()
          closeDialog()
          return
        }
        throw new Error(response.message)
      } catch (err: any) {
        if (err instanceof Error) toast.error(`${err.message}`)
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
      } finally {
        setSubmitLoading(false)
      }
    }
  }
  return (
    <Form {...updateProfileForm}>
      <form
        name="updateProfileForm"
        onSubmit={updateProfileForm.handleSubmit(handleUpdateProfileSubmit)}
        className="flex flex-col gap-4 "
      >
        <div className="flex flex-col gap-4 h-[18rem]">
          <FormField
            control={updateProfileForm.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Nama Depan</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nama Depan"
                    {...field}
                    className="placeholder:text-[#94A3B8] text-base border-[#0073E6] border-2 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-xs -mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={updateProfileForm.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Nama Belakang</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nama Belakang"
                    {...field}
                    className="placeholder:text-[#94A3B8] text-base border-[#0073E6] border-2 rounded-lg"
                  />
                </FormControl>
                <FormMessage className="text-xs -mt-1" />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Tanggal Lahir</FormLabel>
            <div className="flex flex-row gap-2 justify-center">
              <FormField
                control={updateProfileForm.control}
                name="birthDate.day"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        min={1}
                        max={31}
                        type="number"
                        placeholder="Hari"
                        {...field}
                        value={field.value ?? ''}
                        className={'border-[#0073E6] border-2 rounded-lg'}
                      />
                    </FormControl>
                    <FormMessage className="text-xs -mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={updateProfileForm.control}
                name="birthDate.month"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        min={1}
                        max={12}
                        type="number"
                        placeholder="Bulan"
                        {...field}
                        value={field.value ?? ''}
                        className={'border-[#0073E6] border-2 rounded-lg'}
                      />
                    </FormControl>
                    <FormMessage className="text-xs -mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={updateProfileForm.control}
                name="birthDate.year"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Tahun"
                        {...field}
                        value={field.value ?? ''}
                        className={'border-[#0073E6] border-2 rounded-lg'}
                      />
                    </FormControl>
                    <FormMessage className="text-xs -mt-1" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end text-[#2FA9F4] ">
          <button
            type="button"
            onClick={changeEmailButtonHandler}
            className="flex items-center gap-1"
          >
            <span className="text-sm">Ubah Email </span>{' '}
            <ArrowRight size={16} />
          </button>
        </div>
        <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2 ">
          <Button
            disabled={submitLoading}
            type="submit"
            name="submit-button"
            className="bg-gradient-to-br from-[#0073E6] to-[#004080] rounded-lg hover:bg-[#0059B3]/90 text-white w-full  font-normal"
          >
            {submitLoading ? <Loader className="animate-spin" /> : 'Simpan'}
          </Button>
          <Button
            className={`bg-white rounded-lg text-black hover:bg-black/10 border-black/10 border font-normal `}
          >
            <Google />
            <span>Link Akun Google</span>
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
