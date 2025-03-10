'use client'

import { useForm } from 'react-hook-form'
import { useRegisterContext } from '../contexts/RegisterContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

export const CodeVerificationForm: React.FC = () => {
  const {
    goToNextPage,
    registerData: { email, uniqueCode },
    setRegisterData,
  } = useRegisterContext()

  const form = useForm<z.infer<typeof codeVerificationFormSchema>>({
    resolver: zodResolver(codeVerificationFormSchema),
    defaultValues: {
      uniqueCode,
    },
  })

  const submitCodeVerificationForm = (
    values: z.infer<typeof codeVerificationFormSchema>
  ) => {
    setSubmitLoading(true)
    const {
      formState: { errors },
    } = form

    if (!Object.keys(errors).length) {
      setRegisterData((prevValue) => {
        return {
          ...prevValue,
          uniqueCode: values.uniqueCode,
        }
      })
      setSubmitLoading(false)
      goToNextPage()
    }
  }

  useEffect(() => {
    form.reset({ uniqueCode })
  }, [uniqueCode])

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
                Verifikasi
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
