import { type DokuConfig, type DokuPaymentRequest } from './interface'
import crypto from 'crypto'

interface DokuPaymentResponse {
  response: {
    payment: {
      url?: string
      token?: string
    }
  }
}

export class DokuService {
  private static instance: DokuService
  private readonly clientId: string
  private readonly secretKey: string
  private readonly isProduction: boolean
  private readonly baseUrl: string

  private constructor(config: DokuConfig) {
    this.clientId = config.clientId
    this.secretKey = config.secretKey
    this.isProduction = config.isProduction
    this.baseUrl = config.isProduction
      ? 'https://api.doku.com'
      : 'https://api-sandbox.doku.com'
  }

  public static getInstance(config: DokuConfig): DokuService {
    if (!DokuService.instance) {
      DokuService.instance = new DokuService(config)
    }
    return DokuService.instance
  }

  // Generate signature according to DOKU's requirements
  private generateSignature(
    requestId: string,
    requestTimestamp: string,
    requestTarget: string,
    clientId: string,
    requestBody: string
  ): string {
    // Component to be digested
    const componentSignature =
      `Client-Id:${clientId}\n` +
      `Request-Id:${requestId}\n` +
      `Request-Timestamp:${requestTimestamp}\n` +
      `Request-Target:${requestTarget}\n` +
      `Digest:${this.generateDigest(requestBody)}`

    // Generate HMAC-SHA256 signature
    const hmac = crypto.createHmac('sha256', this.secretKey)
    hmac.update(componentSignature)
    return `${Buffer.from(hmac.digest()).toString('base64')}`
  }

  // Generate digest of request body
  private generateDigest(requestBody: string): string {
    const hash = crypto.createHash('sha256')
    hash.update(requestBody, 'utf-8')
    return `${Buffer.from(hash.digest()).toString('base64')}`
  }
  // Format datetime for DOKU API
  private getFormattedTimestamp(): string {
    return new Date().toISOString().slice(0, 19) + 'Z'
  }

  public async createTransaction(
    paymentRequest: DokuPaymentRequest
  ): Promise<string> {
    try {
      const requestId = crypto.randomUUID()
      const requestTimestamp = this.getFormattedTimestamp()
      const requestTarget = '/checkout/v1/payment'

      // Format request body according to DOKU API
      const requestBody = {
        order: {
          amount: paymentRequest.transaction_details.gross_amount,
          invoice_number: paymentRequest.transaction_details.order_id,
          currency: 'IDR',
          callback_url: paymentRequest.callbacks.back,
          callback_url_cancel: paymentRequest.callbacks.cancel,
          callback_url_result: paymentRequest.callbacks.result,
          language: 'ID',
          auto_redirect: true,
        },
        payment: {
          payment_due_date: 1, // Payment due in minutes
        },
        customer: {
          name: `${paymentRequest.customer_details.first_name} ${paymentRequest.customer_details.last_name}`,
          email: paymentRequest.customer_details.email,
          phone: paymentRequest.customer_details.phone,
        },
      }

      const stringifiedBody = JSON.stringify(requestBody)

      // Generate signature for auth header
      const signature = this.generateSignature(
        requestId,
        requestTimestamp,
        requestTarget,
        this.clientId,
        stringifiedBody
      )

      const response = await fetch(`${this.baseUrl}${requestTarget}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': this.clientId,
          'Request-Id': requestId,
          'Request-Timestamp': requestTimestamp,
          Signature: `HMACSHA256=${signature}`,
          Digest: this.generateDigest(stringifiedBody),
        },
      })

      if (!response.ok) {
        throw new Error(
          `DOKU API error: ${response.status} ${response.statusText}`
        )
      }

      const data = (await response.json()) as DokuPaymentResponse

      // DOKU response structure based on their API documentation
      if (data.response?.payment?.url) {
        return data.response.payment.url
      } else if (data.response?.payment?.token) {
        return data.response.payment.token
      } else {
        throw new Error('Invalid response from DOKU API')
      }
    } catch (error) {
      console.error('Error creating DOKU transaction:', error)
      throw error
    }
  }

  // Get payment status
  public async getPaymentStatus(orderId: string): Promise<any> {
    try {
      const requestId = crypto.randomUUID()
      const requestTimestamp = this.getFormattedTimestamp()
      const requestTarget = `/orders/v1/status/${orderId}`

      // Generate signature for auth header
      const signature = this.generateSignature(
        requestId,
        requestTimestamp,
        requestTarget,
        this.clientId,
        ''
      )

      const response = await fetch(`${this.baseUrl}${requestTarget}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': this.clientId,
          'Request-Id': requestId,
          'Request-Timestamp': requestTimestamp,
          Signature: `HMACSHA256=${signature}`,
        },
      })

      if (!response.ok) {
        throw new Error(
          `DOKU API error: ${response.status} ${response.statusText}`
        )
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting payment status from DOKU:', error)
      throw error
    }
  }
}

export const initDoku = (): DokuService => {
  const config: DokuConfig = {
    clientId: process.env.NEXT_PUBLIC_DOKU_CLIENT_ID ?? '',
    secretKey: process.env.DOKU_SECRET_KEY ?? '',
    isProduction: process.env.NODE_ENV === 'production',
  }

  return DokuService.getInstance(config)
}
