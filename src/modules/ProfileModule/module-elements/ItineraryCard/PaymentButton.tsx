'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { resumePaymentDoku } from '@/app/actions/resumePaymentDoku'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import { DokuScript } from '@/modules/TourBookingFormModule/components/DokuScript'

interface PaymentButtonProps {
  transactionId: string
  totalPrice: number
  quantity: number
  tourId: string
  tourName: string
  guests: Array<{
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
  }>
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  transactionId,
  totalPrice,
  quantity,
  tourId,
  tourName,
  guests,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentToken, setPaymentToken] = useState<string | null>(null)
  const { user } = useAuthContext()
  //   const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ''
  const dokuClientId = process.env.NEXT_PUBLIC_DOKU_CLIENT_ID ?? ''

  const primaryGuest = guests[0]

  useEffect(() => {
    if (paymentToken) {
      const dialogOverlay = document.querySelector(
        '[data-state="open"].z-50.fixed.inset-0'
      )
      const dialogContent = document.querySelector(
        '[data-state="open"].z-50.fixed.left-\\[50\\%\\]'
      )
      if (dialogOverlay) {
        dialogOverlay.setAttribute('style', 'visibility: hidden; opacity: 0;')
      }

      if (dialogContent) {
        dialogContent.setAttribute('style', 'visibility: hidden; opacity: 0;')
      }
      // window.snap.pay(paymentToken, paymentCallbacks)
      window.loadJokulCheckout(paymentToken)
    }
  }, [paymentToken, user?.id])

  const handlePayment = async () => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu')
      return
    }

    setIsLoading(true)

    try {
      const result = await resumePaymentDoku({
        userId: user.id,
        transactionId,
        totalPrice,
        quantity,
        customerFirstName: primaryGuest.firstName,
        customerLastName: primaryGuest.lastName,
        customerEmail: primaryGuest.email,
        customerPhone: primaryGuest.phoneNumber,
        tourId,
        tourName,
      })
      console.log(result)
      if (result.success && result.token) {
        setPaymentToken(result.token)
      } else {
        throw new Error(result.error ?? 'Failed to process payment')
      }
    } catch (error: any) {
      console.log(error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(
          'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.'
        )
      }
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* <MidtransScript clientKey={midtransClientKey} /> */}
      <DokuScript clientId={dokuClientId} />
      <div className="p-[1.5px] flex w-full items-center bg-gradient-to-r from-[#0073E6] to-[#004080] hover:from-[#0066cc] hover:to-[#003366] rounded-lg group">
        <Button
          className="h-8 w-full bg-white group-hover:bg-transparent"
          onClick={handlePayment}
          disabled={isLoading}
        >
          <span className="bg-gradient-to-r from-[#0073E6] to-[#004080] group-hover:text-white text-transparent bg-clip-text flex items-center">
            {isLoading ? 'Memproses...' : 'Bayar Sekarang'}
          </span>
        </Button>
      </div>
    </>
  )
}
