'use server'

import { initDoku } from '@/utils/doku/doku'

interface ResumePaymentDetailsDoku {
  userId: string
  transactionId: string
  totalPrice: number
  quantity: number
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  customerPhone: string
  tourId: string
  tourName: string
}

export async function resumePaymentDoku(details: ResumePaymentDetailsDoku) {
  try {
    const dokuService = initDoku()

    // Format sesuai dengan API DOKU Jokul
    const transaction = {
      transaction_details: {
        order_id: details.transactionId,
        gross_amount: details.totalPrice,
      },
      customer_details: {
        first_name: details.customerFirstName,
        last_name: details.customerLastName,
        email: details.customerEmail,
        phone: details.customerPhone,
      },
      callbacks: {
        back: `${process.env.NEXT_PUBLIC_CLIENT_URL}/profile/${details.userId}?tab=transaction`,
        cancel: `${process.env.NEXT_PUBLIC_CLIENT_URL}/profile/${details.userId}?tab=transaction`,
        result: `${process.env.NEXT_PUBLIC_CLIENT_URL}/profile/${details.userId}?tab=transaction&transactionId=${details.transactionId}`,
      },
    }

    // Dapatkan URL pembayaran atau token dari DOKU API
    const paymentToken = await dokuService.createTransaction(transaction)
    console.log('Payment token:', paymentToken)
    return {
      success: true,
      token: paymentToken,
      transactionId: details.transactionId,
    }
  } catch (error) {
    console.error('Error resuming DOKU payment:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to resume DOKU payment'
    return { success: false, error: errorMessage }
  }
}
