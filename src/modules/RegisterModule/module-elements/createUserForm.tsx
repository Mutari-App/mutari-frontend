import { useForm } from 'react-hook-form'
import { useRegisterContext } from '../contexts/RegisterContext'
import { createUserFormSchema } from '../schemas/createUserFormSchema'
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
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Google } from '@/icons/Google'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/utils/firebase'
import { useAuthContext } from '@/contexts/AuthContext'

export const CreateUserForm: React.FC = () => {
  const router = useRouter()
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

    let parseBirthdate: Date | undefined = undefined

    if (!Object.keys(errors).length) {
      setRegisterData((prevValue) => {
        parseBirthdate =
          values.birthDate?.year !== undefined &&
          values.birthDate?.month !== undefined &&
          values.birthDate?.day !== undefined
            ? new Date(
                values.birthDate.year,
                values.birthDate.month - 1,
                values.birthDate.day
              )
            : undefined

        return {
          ...prevValue,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          birthDate: parseBirthdate,
        }
      })

      try {
        const response = await customFetch('/auth/createUser', {
          method: 'POST',
          body: customFetchBody({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            birthDate: parseBirthdate
              ? (parseBirthdate as Date).toISOString()
              : undefined,
          }),
        })

        if (response.statusCode === 201) {
          toast.success('Kode verifikasi dikirim! Silakan cek email Anda.')
          setSubmitLoading(false)
          goToNextPage()
          return
        } else if (response.statusCode === 409) {
          toast.error('Email ini sudah terdaftar!')
          setSubmitLoading(false)
          return router.push('/login')
        } else {
          toast.error('Terjadi kesalahan. Silakan coba lagi.')
          setSubmitLoading(false)
        }
      } catch (error) {
        toast.error('Terjadi kesalahan. Silakan coba lagi.')
        setSubmitLoading(false)
        throw error
      }
    }
  }

  useEffect(() => {
    form.reset({
      firstName,
      lastName,
      email,
      birthDate: { day: undefined, month: undefined, year: undefined },
    })
  }, [firstName, lastName, email, birthDate, form])

  const [submitLoading, setSubmitLoading] = useState(false)

  const { googleRegister } = useAuthContext()

  const registerGoogle = async () => {
    try {
      setSubmitLoading(true)

      const result = await signInWithPopup(auth, new GoogleAuthProvider())

      const googleUser = result.user
      const firebaseToken = await googleUser.getIdToken()
      await googleRegister({ firebaseToken })
      router.push('/')
      toast.success('Berhasil daftar!')
    } catch (err: any) {
      let errMsg = (err as Error).message
      if (errMsg === 'User already exists') {
        router.push('/login')
        errMsg = 'Email sudah terdaftar. Silakan login.'
      }
      toast.error(errMsg)
      throw err
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        name="createUserForm"
        onSubmit={form.handleSubmit(submitCreateUserForm)}
      >
        <div className="flex flex-col gap-5 md:gap-8 text-[#024C98]">
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

            <div className="space-y-2">
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
          </div>

          <div className="flex flex-col gap-y-2">
            <Button
              disabled={submitLoading}
              type="submit"
              name="submit-button"
              className="bg-[#0059B3] hover:bg-[#0059B3]/90 text-white w-full"
            >
              {submitLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Daftar Akun'
              )}
            </Button>
            <div className="flex items-center justify-center gap-2 text-[#9dbaef] w-full">
              <Separator className="bg-[#9dbaef] flex-grow w-1/3 h-[0.5px]" />
              <span className="text-center px-2 text-sm">atau</span>
              <Separator className="bg-[#9dbaef] flex-grow w-1/3 h-[0.5px]" />
            </div>
            <Button
              disabled={submitLoading}
              className="text-black w-full"
              variant={'outline'}
              type="button"
              onClick={registerGoogle}
            >
              {submitLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Google /> Daftar dengan Google
                </>
              )}
            </Button>
          </div>

          <span className="text-sm text-center text-[#024C98] font-medium">
            Sudah punya akun?{' '}
            <Link href="/login" className="underline">
              Login di sini
            </Link>
          </span>
        </div>
      </form>
    </Form>
  )
}
