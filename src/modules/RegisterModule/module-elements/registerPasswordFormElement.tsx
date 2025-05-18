'use client'
import React from 'react'
import {
  Form,
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

interface RegisterPasswordFormValues {
  password: string
  confirmPassword: string
}

interface RegisterPasswordElementProps {
  form: UseFormReturn<RegisterPasswordFormValues>
  submitRegisterForm: (values: RegisterPasswordFormValues) => Promise<void>
  submitLoading: boolean
}

export const RegisterPasswordElement: React.FC<
  RegisterPasswordElementProps
> = ({ form, submitRegisterForm, submitLoading }) => {
  return (
    <Form {...form}>
      <form
        name="registerForm"
        onSubmit={form.handleSubmit(submitRegisterForm)}
        className="w-[65%]"
      >
        <div className="flex flex-col md:gap-8 text-[#024C98] w-[100%]">
          <div className="flex flex-col gap-5 text-center font-semibold">
            <h1 className="text-4xl">Buat Password</h1>
            <span className="text-xl font-raleway">
              Jangan lupakan passwordmu!
            </span>
          </div>

          <div className="font-medium space-y-5 w-full">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Password*</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Konfirmasi Password</FormLabel>

                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Konfirmasi Password"
                      {...field}
                      className="placeholder:text-[#94A3B8] text-base w-[100%]"
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
                  'Simpan password'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
