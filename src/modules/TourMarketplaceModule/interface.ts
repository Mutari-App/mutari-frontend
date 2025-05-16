import { type CustomFetchBaseResponse } from '@/utils/newCustomFetch/interface'

export interface RecentlyViewedTourResponse extends CustomFetchBaseResponse {
  tours: TourView[]
}

export interface TourView {
  updatedAt: string
  createdAt: string
  id: string
  userId: string
  tourId: string
  viewedAt: string
  tour: Tour
}

export interface Tour {
  id: string
  title: string
  coverImage?: string
  maxCapacity: number
  description?: string
  location: string
  pricePerTicket: string
  duration: number
  durationType: 'HOUR' | 'DAY'
  itineraryId: string
  createdAt: string
  updatedAt: string
}

export interface TourCardProps {
  readonly tour: Tour
}
