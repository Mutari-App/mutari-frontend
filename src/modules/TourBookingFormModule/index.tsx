'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  type BuyTourResultInterface,
  type TourBookingFormModuleProps,
} from './interface'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { DokuScript } from './components/DokuScript'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { getImage } from '@/utils/getImage'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { useAuthContext } from '@/contexts/AuthContext'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { customFetch, customFetchBody } from '@/utils/newCustomFetch'
import { createPaymentDoku } from '@/app/actions/paymentDoku'

// Define guest schema
const guestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email address'),
})

// Define form schema
const formSchema = z.object({
  customer: guestSchema,
  visitors: z.array(guestSchema),
})

type FormValues = z.infer<typeof formSchema>

export const TourBookingFormModule: React.FC<TourBookingFormModuleProps> = ({
  tourDetail,
  guests,
  tourDate,
}) => {
  const { user } = useAuthContext()
  // Format date
  const formattedDate = tourDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Total price calculation
  const totalPrice = tourDetail.pricePerTicket * guests

  // Router for navigation
  const router = useRouter()

  // State for loading and payment process
  const [isLoading, setIsLoading] = useState(false)
  const [paymentToken, setPaymentToken] = useState<string | null>(null)
  //   const [orderId, setOrderId] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  //   const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ''
  const dokuClientId = process.env.NEXT_PUBLIC_DOKU_CLIENT_ID ?? ''

  useEffect(() => {
    if (paymentToken) {
      // window.snap.pay(paymentToken, paymentCallbacks)
      window.loadJokulCheckout(paymentToken)
    }
  }, [paymentToken, user?.id])

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: {
        title: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
      },
      visitors: Array(guests)
        .fill(0)
        .map(() => ({
          title: '',
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
        })),
    },
  })

  // Initialize the field array
  const { fields } = useFieldArray({
    control: form.control,
    name: 'visitors',
  })

  const handleOpenConfirmation = async () => {
    const isValid = await form.trigger()
    if (isValid) {
      setShowConfirmation(true)
    }
  }

  const handleConfirmation = () => {
    setShowConfirmation(false)
    void form.handleSubmit(onSubmit)()
  }

  // Format customer data for API
  const formatCustomerData = (customer: FormValues['customer']) => ({
    title: customer.title,
    firstName: customer.firstName,
    lastName: customer.lastName,
    phoneNumber: customer.phone,
    email: customer.email,
  })

  // Format visitors data for API
  const formatVisitorsData = (visitors: FormValues['visitors']) =>
    visitors.map((visitor) => ({
      title: visitor.title,
      firstName: visitor.firstName,
      lastName: visitor.lastName,
      phoneNumber: visitor.phone,
      email: visitor.email,
    }))

  // Handle transaction errors
  const handleTransactionError = (transaction: BuyTourResultInterface) => {
    if (transaction.statusCode === 404) {
      router.push('/tour')
      throw new Error('Tour tidak ditemukan!')
    }
    if (transaction.statusCode === 400) {
      router.push(`/tour/${tourDetail.id}`)
      throw new Error('Kapasitas tidak tersedia!')
    }
    if (transaction.statusCode !== 201) {
      throw new Error(
        'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.'
      )
    }
    return transaction
  }

  const onSubmit = async (data: FormValues) => {
    if (!user) return

    try {
      setIsLoading(true)

      // Create transaction
      const transaction = await customFetch<BuyTourResultInterface>(
        `/tour/${tourDetail.id}/buy`,
        {
          method: 'POST',
          body: customFetchBody({
            tourDate,
            quantity: guests,
            customer: formatCustomerData(data.customer),
            visitors: formatVisitorsData(data.visitors),
          }),
        }
      )

      // Validate transaction
      const validatedTransaction = handleTransactionError(transaction)

      // Payment details for both providers
      const paymentDetails = {
        userId: user.id,
        transactionId: validatedTransaction.id,
        customerFirstName: data.customer.firstName,
        customerLastName: data.customer.lastName,
        customerEmail: data.customer.email,
        customerPhone: data.customer.phone,
        tourId: tourDetail.id,
        tourName: tourDetail.title,
        pricePerPerson: tourDetail.pricePerTicket,
        numberOfGuests: guests,
      }

      const result = await createPaymentDoku({
        ...paymentDetails,
      })

      // Handle payment result
      if (result.success && result.token) {
        setPaymentToken(result.token)
        // setOrderId(result.transactionId || null)
      } else {
        throw new Error(result.error ?? 'Failed to create payment')
      }
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(
          'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 pt-24  sm:pt-32 pb-20 font-raleway">
      {/* <MidtransScript clientKey={midtransClientKey} /> */}
      <DokuScript clientId={dokuClientId} />

      <h1 className="text-2xl font-bold  font-poppins mb-6">
        Formulir Pemesanan
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <FormProvider {...form}>
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  void handleOpenConfirmation()
                }}
                className="space-y-10"
              >
                {/* Main Guest Section */}
                <div className="bg-white  rounded-xl shadow-sm">
                  <h2 className="text-lg font-semibold  mb-4">Data Kustomer</h2>

                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`customer.title`}
                      render={({ field }) => (
                        <FormItem className="md:col-span-1">
                          <FormLabel>Title</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MR">MR</SelectItem>
                              <SelectItem value="MRS">MRS</SelectItem>
                              <SelectItem value="MS">MS</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customer.firstName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-3">
                          <FormLabel>Nama Belakang</FormLabel>
                          <FormControl>
                            <Input placeholder="Nama Belakang" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customer.lastName"
                      render={({ field }) => (
                        <FormItem className="md:col-span-3">
                          <FormLabel>Nama Depan</FormLabel>
                          <FormControl>
                            <Input placeholder="Nama Depan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customer.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Handphone</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="08xxxxxxxxx"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="customer.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="customer@example.com"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500 mt-1">
                            Tiket elektronik akan dikirim melalui email ini
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Visitors */}
                {fields.map((field, index) => (
                  <div key={field.id} className="bg-white rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold  mb-4">
                      Data Pengunjung (Pengunjung {index + 1})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name={`visitors.${index}.title`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-1">
                            <FormLabel>Title</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="MR">MR</SelectItem>
                                <SelectItem value="MRS">MRS</SelectItem>
                                <SelectItem value="MS">MS</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`visitors.${index}.firstName`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-3">
                            <FormLabel>Nama Belakang</FormLabel>
                            <FormControl>
                              <Input placeholder="Nama Belakang" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`visitors.${index}.lastName`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-3">
                            <FormLabel>Nama Depan</FormLabel>
                            <FormControl>
                              <Input placeholder="Nama Depan" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`visitors.${index}.phone`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor Handphone</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="08xxxxxxxxx"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`visitors.${index}.email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="visitor@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-[#016CD7] to-[#014285] text-white py-2 px-6 rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                  </Button>
                </div>
              </form>
            </Form>
          </FormProvider>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl drop-shadow-lg shadow-black sticky top-20">
            <h2 className="text-lg font-semibold  mb-4">Ringkasan Pesanan</h2>

            <div className="mb-4">
              <div className="aspect-video relative rounded-lg overflow-hidden mb-2">
                <Image
                  src={tourDetail.coverImage ?? getImage('no-image.png')}
                  alt={tourDetail.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-medium">Open Trip Baduy 2D1N</h3>
              <p className="text-sm text-gray-600">
                {(() => {
                  const originalPrice =
                    tourDetail.pricePerTicket * (100 / (100 - 20))

                  return (
                    <div className="flex flex-col w-full ">
                      <div className="flex flex-col  relative w-fit">
                        <div className="flex items-center gap-1.5 ">
                          <span className="text-gray-500 line-through text-xs">
                            Rp{Number(originalPrice).toLocaleString('ID-id')}
                          </span>
                          <span className="bg-red-100 text-red-600 text-xs px-1.5 py-[1px] rounded-md font-medium whitespace-nowrap">
                            20% OFF
                          </span>
                        </div>
                        <span className="text-[#024C98] font-semibold">
                          Rp
                          {Number(tourDetail.pricePerTicket).toLocaleString(
                            'ID-id'
                          )}
                          /pax
                        </span>
                      </div>
                    </div>
                  )
                })()}{' '}
              </p>
            </div>

            <div className="space-y-2 text-sm  py-4 my-4">
              <div className="flex justify-between">
                <span>Tanggal keberangkatan</span>
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Durasi perjalanan</span>
                <span className="font-medium">2 hari</span>
              </div>
              <div className="flex justify-between">
                <span>Jumlah peserta</span>
                <span className="font-medium">{guests} orang</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg  ">
              <span>Total harga</span>
              <span>Rp{totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Pemesanan</DialogTitle>
            <DialogDescription>
              Pastikan semua data yang Anda masukkan sudah benar. Klik
              Konfirmasi untuk melanjutkan ke proses pembayaran.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Batal
            </Button>
            <Button
              className="bg-gradient-to-r from-[#016CD7] to-[#014285]"
              onClick={handleConfirmation}
              disabled={isLoading}
            >
              Konfirmasi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
