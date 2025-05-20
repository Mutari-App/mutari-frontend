'use server'

import { initDoku } from '@/utils/doku/doku'

interface PaymentDetailsDoku {
  userId: string
  transactionId: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  customerPhone: string
  tourId: string
  tourName: string
  pricePerPerson: number
  numberOfGuests: number
}

export async function createPaymentDoku(details: PaymentDetailsDoku) {
  try {
    const totalAmount = details.pricePerPerson * details.numberOfGuests
    const dokuService = initDoku()

    const transaction = {
      transaction_details: {
        order_id: details.transactionId,
        gross_amount: totalAmount,
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

    const token = await dokuService.createTransaction(transaction)

    return { success: true, token, transactionId: details.transactionId }
  } catch (error) {
    console.error('Error creating DOKU payment:', error)
    return { success: false, error: 'Failed to create DOKU payment' }
  }
}
