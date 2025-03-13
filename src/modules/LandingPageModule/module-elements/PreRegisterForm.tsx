'use client'

// import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

import {
  type PreRegisterResponse,
  //   type CityProps,
  //   type CountryProps,
  //   type GetCitiesResponse,
  //   type GetCountriesResponse,
  type PreRegisterFormProps,
} from '../interface'
import { customFetch, customFetchBody } from '@/utils/customFetch'
import { toast } from 'sonner'
import { useState } from 'react'
import { CheckCircle, Loader } from 'lucide-react'

// import { customFetch } from '@/utils/customFetch'

const preRegisterSchema = z.object({
  firstName: z.string().min(2, 'Nama depan minimal 2 karakter'),
  lastName: z.string().optional(),
  email: z.string().email('Masukkan email yang valid'),
  phoneNumber: z.string().min(8, 'Nomor telepon tidak valid'),
  //   country: z.string().min(2, 'Pilih negara'),
  //   city: z.string().min(2, 'Pilih kota'),
  referralCode: z.string().optional(),
})

export const PreRegisterForm: React.FC<PreRegisterFormProps> = ({
  isSuccess,
  setIsSuccess,
  showLoginForm,
  email,
  setEmail,
}) => {
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  //   const [countries, setCountries] = useState<CountryProps[]>([])
  //   const [countryInput, setCountryInput] = useState<string>('')
  //   const [countryLoading, setCountryLoading] = useState<boolean>(false)
  //   const [selectedCountry, setSelectedCountry] = useState<string>('')

  //   const [cities, setCities] = useState<CityProps[]>([])
  //   const [cityInput, setCityInput] = useState<string>('')
  //   const [cityLoading, setCityLoading] = useState<boolean>(false)
  //   const [selectedCity, setSelectedCity] = useState<string>('')

  const form = useForm({
    resolver: zodResolver(preRegisterSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      //   country: '',
      //   city: '',
      referralCode: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof preRegisterSchema>) => {
    try {
      setSubmitLoading(true)
      const normalizedPhoneNumber = values.phoneNumber.startsWith('0')
        ? values.phoneNumber.slice(1)
        : values.phoneNumber

      const response = await customFetch<PreRegisterResponse>('/pre-register', {
        method: 'POST',
        body: customFetchBody({
          ...values,
          phoneNumber: normalizedPhoneNumber,
          referralCode:
            values.referralCode?.length !== 0 ? values.referralCode : null,
        }),
      })

      if (response.statusCode !== 200) throw new Error(response.message)
      setEmail(values.email)
      setIsSuccess(true)
      toast.success('Praregistrasi berhasil!', {
        description: 'Silahkan cek email anda!',
      })
    } catch (err) {
      if (err instanceof Error) toast.error(`${err.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  return isSuccess ? (
    <div className="relative  rounded-2xl p-8 text-center text-white shadow-xl  ">
      <CheckCircle className="mx-auto h-16 w-16 text-green-400 mb-6" />
      <h2 className="text-2xl font-bold mb-6">Praregistrasi Berhasil!</h2>
      <div className="space-y-4 mb-8">
        <p className="text-lg">
          Silahkan cek email <strong>{email}</strong> untuk informasi login.
        </p>
        <p className="text-lg">
          Setelah login, Anda akan mendapatkan <strong>kode referral</strong>.
          Bagikan kode referral dan dapatkan <strong>hadiah menarik</strong>!
        </p>
      </div>
      <Button onClick={showLoginForm} variant={'secondary'} className="w-full">
        Login
      </Button>
    </div>
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative grid grid-cols-1 md:grid-cols-2 gap-y-3 sm:gap-y-6 gap-x-3"
      >
        {/* Nama Depan */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
              <FormLabel>Nama Depan*</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama depan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nama Akhir */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
              <FormLabel>Nama Akhir</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama akhir" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Masukkan alamat email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* No. HP */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="col-span-2 sm:col-span-1">
              <FormLabel>No. HP*</FormLabel>
              <FormControl>
                <Input
                  prefix="+62"
                  type="number"
                  placeholder="Masukkan nomor telepon"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Negara */}
        {/* <FormField
       control={form.control}
       name="country"
       render={({ field }) => (
         <FormItem className="flex flex-col">
           <FormLabel>Negara*</FormLabel>
           <Popover>
             <PopoverTrigger asChild>
               <FormControl>
                 <Button
                   variant="outline"
                   role="combobox"
                   className={cn(
                     'w-[200px]  justify-between',
                     !field.value && 'text-muted-foreground'
                   )}
                 >
                   {field.value ? selectedCountry : 'Pilih negara'}
                   <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                 </Button>
               </FormControl>
             </PopoverTrigger>
             <PopoverContent className="w-[200px] p-0">
               <Command>
                 <CommandInput
                   onInput={(e) => {
                     setCountryInput(e.currentTarget.value)
                   }}
                   placeholder="Masukan nama negara..."
                 />
                 {countryLoading ? (
                   <>
                     <Loader className="animate-spin mx-auto" />
                   </>
                 ) : (
                   <CommandList>
                     {countryInput.length !== 0 &&
                       countries.length === 0 &&
                       !countryLoading && (
                         <CommandEmpty>Negara tidak ditemukan!</CommandEmpty>
                       )}
                     <CommandGroup>
                       {countries.map((country) => (
                         <CommandItem
                           value={country.name}
                           key={country.id}
                           onSelect={() => {
                             setSelectedCountry(country.name)
                             form.setValue('country', country.id)
                           }}
                         >
                           {country.name}
                           <Check
                             className={cn(
                               'ml-auto',
                               country.id === field.value
                                 ? 'opacity-100'
                                 : 'opacity-0'
                             )}
                           />
                         </CommandItem>
                       ))}
                     </CommandGroup>
                   </CommandList>
                 )}
                 <div className="flex items-center gap-1 justify-center py-1">
                   <span className="text-gray-600 text-xs">powered by </span>
                   <div className="h-5 aspect-[2]  relative">
                     <Image
                       src={getImage('google-small.png')}
                       alt="Google Logo"
                       fill
                       className="object-contain"
                     />
                   </div>
                 </div>
               </Command>
             </PopoverContent>
           </Popover>
           <FormMessage />
         </FormItem>
       )}
     /> */}

        {/* Kota */}
        {/* <FormField
       control={form.control}
       name="city"
       render={({ field }) => (
         <FormItem className="flex  flex-col">
           <FormLabel>Kota*</FormLabel>
           <Popover>
             <PopoverTrigger
               asChild
               disabled={form.getValues('country').length === 0}
             >
               <FormControl>
                 <Button
                   variant="outline"
                   role="combobox"
                   className={cn(
                     'w-[200px] justify-between',
                     !field.value && 'text-muted-foreground'
                   )}
                 >
                   {field.value ? selectedCity : 'Pilih kota'}
                   <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                 </Button>
               </FormControl>
             </PopoverTrigger>
             <PopoverContent className="w-[200px] p-0">
               <Command>
                 <CommandInput
                   onInput={(e) => {
                     setCityInput(e.currentTarget.value)
                   }}
                   placeholder="Masukan nama kota..."
                 />
                 {cityLoading ? (
                   <>
                     <Loader className="animate-spin mx-auto" />
                   </>
                 ) : (
                   <CommandList>
                     {cityInput.length !== 0 &&
                       cities.length === 0 &&
                       !cityLoading && (
                         <CommandEmpty>Kota tidak ditemukan!</CommandEmpty>
                       )}
                     <CommandGroup>
                       {cities.map((city) => (
                         <CommandItem
                           value={city.name}
                           key={city.id}
                           onSelect={() => {
                             setSelectedCity(city.name)
                             form.setValue('city', city.id)
                           }}
                         >
                           {city.name}
                           <Check
                             className={cn(
                               'ml-auto',
                               city.id === field.value
                                 ? 'opacity-100'
                                 : 'opacity-0'
                             )}
                           />
                         </CommandItem>
                       ))}
                     </CommandGroup>
                   </CommandList>
                 )}
                 <div className="flex items-center gap-1 justify-center py-1">
                   <span className="text-gray-600 text-xs">powered by </span>
                   <div className="h-5 aspect-[2]  relative">
                     <Image
                       src={getImage('google-small.png')}
                       alt="Google Logo"
                       fill
                       className="object-contain"
                     />
                   </div>
                 </div>
               </Command>
             </PopoverContent>
           </Popover>
           <FormMessage />
         </FormItem>
       )}
     /> */}

        {/* Kode Referal */}
        <FormField
          control={form.control}
          name="referralCode"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Kode Referal</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Masukkan kode referal (opsional)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="col-span-2 flex justify-center">
          <Button disabled={submitLoading} variant={'secondary'} type="submit">
            {submitLoading ? (
              <Loader className="animate-spin" />
            ) : (
              'Praregistrasi'
            )}
          </Button>
        </div>

        {/* Login Link */}
        <div className="col-span-2 flex justify-center text-xs gap-1">
          <span className="">Sudah punya akun?</span>
          <button onClick={showLoginForm} className="underline font-semibold">
            Login di sini
          </button>
        </div>
      </form>
    </Form>
  )
}
