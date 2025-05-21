'use server'

import { initMidtrans } from '@/utils/midtrans/midtrans'

interface ResumePaymentDetails {
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

export async function resumePayment(details: ResumePaymentDetails) {
  try {
    const midtransService = initMidtrans()

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
      item_details: [
        {
          id: details.tourId,
          price: details.totalPrice / details.quantity, // Calculate price per person
          quantity: details.quantity,
          name: details.tourName,
        },
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_CLIENT_URL}/profile/${details.userId}?tab=transaction`,
        error: `${process.env.NEXT_PUBLIC_CLIENT_URL}/profile/${details.userId}?tab=transaction`,
        pending: `${process.env.NEXT_PUBLIC_CLIENT_URL}/profile/${details.userId}?tab=transaction`,
      },
    }

    const token = await midtransService.createTransaction(transaction)
    return { success: true, token, transactionId: details.transactionId }
  } catch (error) {
    console.error('Error resuming payment:', error)
    return { success: false, error: 'Failed to resume payment' }
  }
}
