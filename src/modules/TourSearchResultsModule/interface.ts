import { type CustomFetchBaseResponse } from '@/utils/customFetch/interface'

export interface UserInfo {
  id: string
  firstName: string
  lastName?: string
  photoProfile?: string | null
}

export interface TourSearchResult {
  id: string
  title: string
  coverImage?: string | null
  maxCapacity: number
  description?: string | null
  location: string
  pricePerTicket: number
  duration: number
  durationType: 'HOUR' | 'DAY'
  availableTickets: number
  includes?: string[] | null
  itinerary?: string | null
  user: UserInfo
}

export interface SearchMetadata {
  total: number
  page: number
  totalPages: number
}

export interface SearchToursResponse extends CustomFetchBaseResponse {
  data: TourSearchResult[]
  metadata: SearchMetadata
}

export interface TourFilters {
  location?: string
  minPrice?: string
  maxPrice?: string
  minDuration?: string
  maxDuration?: string
  durationType?: string
  hasAvailableTickets?: boolean
  sortBy: '' | 'pricePerTicket' | 'duration' | 'availableTickets' | 'createdAt'
  order: '' | 'asc' | 'desc'
}
