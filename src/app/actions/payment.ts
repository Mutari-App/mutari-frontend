'use server'

import { initMidtrans, generateOrderId } from '@/utils/midtrans/midtrans'

interface PaymentDetails {
  userId: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  customerPhone: string
  tourId: string
  tourName: string
  pricePerPerson: number
  numberOfGuests: number
}

export async function createPayment(details: PaymentDetails) {
  try {
    const orderId = generateOrderId()
    const totalAmount = details.pricePerPerson * details.numberOfGuests
    const midtransService = initMidtrans()

    const transaction = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
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
          price: details.pricePerPerson,
          quantity: details.numberOfGuests,
          name: details.tourName,
        },
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_CLIENT_URL}/profile/${details.userId}`,
        error: `${process.env.NEXT_PUBLIC_CLIENT_URL}/profile/${details.userId}`,
        pending: `${process.env.NEXT_PUBLIC_CLIENT_URL}/profile/${details.userId}`,
      },
    }

    const token = await midtransService.createTransaction(transaction)

    return { success: true, token, orderId }
  } catch (error) {
    console.error('Error creating payment:', error)
    return { success: false, error: 'Failed to create payment' }
  }
}
