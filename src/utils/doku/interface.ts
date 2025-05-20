export interface DokuConfig {
  clientId: string
  secretKey: string
  isProduction: boolean
}

// Sesuai dengan format API DOKU Jokul sebenarnya
export interface CustomerDetails {
  first_name: string
  last_name: string
  email: string
  phone: string
}

export interface ItemDetails {
  id: string
  price: number
  quantity: number
  name: string
}

export interface TransactionDetails {
  order_id: string
  gross_amount: number
}

// Format permintaan untuk API Jokul DOKU
export interface DokuPaymentRequest {
  transaction_details: TransactionDetails
  customer_details: CustomerDetails
  callbacks: {
    back: string
    cancel: string
    result: string
  }
}

// Format respons dari API DOKU
export interface DokuPaymentResponse {
  response: {
    payment?: {
      url?: string
      token?: string
    }
    order?: {
      invoice_number: string
      amount: number
      session_id: string
    }
  }
  status: {
    code: string
    message: string
  }
}

// Format status pembayaran DOKU
export interface DokuPaymentStatus {
  response: {
    order: {
      invoice_number: string
      amount: number
      completed_time?: string
      status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'EXPIRED'
    }
    transaction: {
      date: string
      payment_channel: string
    }
  }
  status: {
    code: string
    message: string
  }
}
