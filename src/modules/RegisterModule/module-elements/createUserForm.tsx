import { useForm } from 'react-hook-form'
import { useRegisterContext } from '../contexts/RegisterContext'
import { createUserFormSchema } from '../schemas/createUserFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

export const CreateUserForm: React.FC = () => {
  const {
    goToNextPage,
    registerData: { firstName, lastName, email, birthDate },
    setRegisterData,
  } = useRegisterContext()

  const form = useForm<z.infer<typeof createUserFormSchema>>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      birthDate: {
        day: undefined,
        month: undefined,
        year: undefined,
      },
    },
  })

  const submitCreateUserForm = async (
    values: z.infer<typeof createUserFormSchema>
  ) => {
    setSubmitLoading(true)
    const {
      formState: { errors },
    } = form
    console.log(errors)

    if (!Object.keys(errors).length) {
      setRegisterData((prevValue) => {
        return {
          ...prevValue,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          birthDate:
            values.birthDate?.year !== undefined &&
            values.birthDate?.month !== undefined &&
            values.birthDate?.day !== undefined
              ? new Date(
                  values.birthDate.year,
                  values.birthDate.month - 1,
                  values.birthDate.day
                )
              : undefined,
        }
      })

      setSubmitLoading(false)

      goToNextPage()
    }
  }

  useEffect(() => {
    form.reset({
      firstName,
      lastName,
      email,
      birthDate: { day: undefined, month: undefined, year: undefined },
    })
  }, [firstName, lastName, email, birthDate])

  const [submitLoading, setSubmitLoading] = useState(false)

  return (
    <Form {...form}>
      <form
        name="createUserForm"
        onSubmit={form.handleSubmit(submitCreateUserForm)}
      >
        <div className="flex flex-col md:gap-8 text-[#024C98]">
          <div className="flex flex-col gap-5 text-center font-semibold">
            <h1 className="text-4xl">Buat Akun Baru</h1>
            <span className="text-xl font-raleway">
              Daftar untuk memulai petualangan baru
            </span>
          </div>

          <div className="font-medium space-y-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Nama Depan*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama Depan"
                      {...field}
                      className="placeholder:text-[#94A3B8] text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Nama Belakang</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama Belakang"
                      {...field}
                      className="placeholder:text-[#94A3B8] text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Email*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      className="placeholder:text-[#94A3B8] text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Tanggal Lahir</FormLabel>
              <div className="flex flex-row gap-4 justify-center">
                <FormField
                  control={form.control}
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate.year"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Tahun"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                disabled={submitLoading}
                type="submit"
                name="submit-button"
                className="bg-[#0059B3] hover:bg-[#0059B3]/90 text-white w-full"
              >
                Daftar Akun
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
