import { type Tour } from '../TourMarketplaceModule/interface'

export interface TourBookingFormModuleProps {
  tourDetail: Tour
  guests: number
  tourDate: Date
}

export interface MidtransScriptProps {
  clientKey: string
  onLoad?: () => void
}

export interface BuyTourResultInterface {
  id: string
  statusCode: number
}
