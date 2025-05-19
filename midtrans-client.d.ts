declare module 'midtrans-client' {
  interface MidtransConfig {
    isProduction: boolean
    serverKey: string
    clientKey: string
  }

  export class Snap {
    constructor(config: MidtransConfig)
    createTransaction(parameter: any): Promise<{ token: string }>
  }

  export class CoreApi {
    constructor(config: MidtransConfig)
    transaction: {
      status(orderId: string): Promise<any>
    }
  }
}
