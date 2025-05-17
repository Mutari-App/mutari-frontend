'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { resumePayment } from '@/app/actions/resumePayment'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import { MidtransScript } from '@/modules/TourBookingFormModule/components/MidtransScript'

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
  const [snapToken, setSnapToken] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuthContext()
  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ''

  // Use the first guest as the primary customer
  const primaryGuest = guests[0]

  // Effect to open Midtrans popup when token is received
  useEffect(() => {
    if (snapToken && typeof window !== 'undefined' && window.snap && user) {
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

      setIsLoading(true)
      window.snap.pay(snapToken, {
        onSuccess: function (_result: any) {
          toast.success('Pembayaran Berhasil')
          setIsLoading(false)
          router.refresh()
          if (dialogOverlay) dialogOverlay.removeAttribute('style')
          if (dialogContent) dialogContent.removeAttribute('style')
        },
        onPending: function (_result: any) {
          toast.warning('Pembayaran Pending')
          setIsLoading(false)
          router.refresh()
          if (dialogOverlay) dialogOverlay.removeAttribute('style')
          if (dialogContent) dialogContent.removeAttribute('style')
        },
        onError: function (_result: any) {
          toast.error('Pembayaran Gagal', {
            description:
              'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.',
          })
          setIsLoading(false)
          if (dialogOverlay) dialogOverlay.removeAttribute('style')
          if (dialogContent) dialogContent.removeAttribute('style')
        },
        onClose: function () {
          console.log('Customer closed the popup without finishing payment')
          setIsLoading(false)
          if (dialogOverlay) dialogOverlay.removeAttribute('style')
          if (dialogContent) dialogContent.removeAttribute('style')
        },
      })
    }
  }, [snapToken, orderId, router, user])

  const handlePayment = async () => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu')
      return
    }

    setIsLoading(true)

    try {
      const result = await resumePayment({
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

      if (result.success && result.token) {
        setSnapToken(result.token)
        setOrderId(result.transactionId || null)
      } else {
        throw new Error(result.error ?? 'Failed to process payment')
      }
    } catch (error: any) {
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
      <MidtransScript clientKey={midtransClientKey} />
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
