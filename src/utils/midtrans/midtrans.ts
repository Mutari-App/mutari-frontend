import Midtrans from 'midtrans-client'

import { type MidtransConfig, type MidtransPaymentRequest } from './interface'

export class MidtransService {
  private static instance: MidtransService
  private readonly snap: Midtrans.Snap

  private constructor(config: MidtransConfig) {
    this.snap = new Midtrans.Snap({
      isProduction: config.isProduction,
      serverKey: config.serverKey,
      clientKey: config.clientKey,
    })
  }

  public static getInstance(config: MidtransConfig): MidtransService {
    if (!MidtransService.instance) {
      MidtransService.instance = new MidtransService(config)
    }
    return MidtransService.instance
  }

  public async createTransaction(
    paymentRequest: MidtransPaymentRequest
  ): Promise<string> {
    try {
      const parameter = {
        transaction_details: paymentRequest.transaction_details,
        customer_details: paymentRequest.customer_details,
        item_details: paymentRequest.item_details,
        enabled_payments: paymentRequest.enabled_payments ?? [
          'credit_card',
          'bca_va',
          'bni_va',
          'bri_va',
          'permata_va',
          'gopay',
          'shopeepay',
        ],
        callbacks: {
          finish: paymentRequest.callbacks.finish,
          error: paymentRequest.callbacks.error,
          pending: paymentRequest.callbacks.pending,
        },
      }

      const transaction = await this.snap.createTransaction(parameter)
      return transaction.token
    } catch (error) {
      console.error('Error creating Midtrans transaction:', error)
      throw error
    }
  }
}

export const initMidtrans = (): MidtransService => {
  const config: MidtransConfig = {
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? '',
    serverKey: process.env.MIDTRANS_SERVER_KEY ?? '',
    isProduction: process.env.NODE_ENV === 'production',
  }

  return MidtransService.getInstance(config)
}

export const generateOrderId = (): string => {
  return `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}
