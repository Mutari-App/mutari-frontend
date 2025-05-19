declare module 'doku-client' {
  interface DokuConfig {
    isProduction: boolean
    clientId: string
    secretKey: string
  }

  export class JokulCheckout {
    constructor(config: DokuConfig)
    createPayment(parameter: any): Promise<{ token: string }>
  }

  export class DokuApi {
    constructor(config: DokuConfig)
    transaction: {
      status(orderId: string): Promise<any>
    }
  }
}
