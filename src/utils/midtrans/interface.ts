export interface MidtransConfig {
  clientKey: string
  serverKey: string
  isProduction: boolean
}

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

export interface MidtransPaymentRequest {
  transaction_details: TransactionDetails
  customer_details: CustomerDetails
  item_details: ItemDetails[]
  enabled_payments?: string[]
  callbacks: {
    finish: string
    error: string
    pending: string
  }
}
