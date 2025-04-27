import type { CustomFetchBaseResponse } from '@/utils/customFetch/interface'

export type metadataType = {
  total: number
  page: number
  totalPages: number
}

export type clientMetadataType = {
  total: number
  page: number
  totalPages: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}

export interface ItineraryResponse extends CustomFetchBaseResponse {
  itinerary: {
    data: ItineraryData[]
    metadata: metadataType
  }
}
export interface CompletedItineraryResponse extends CustomFetchBaseResponse {
  itinerary: ItineraryData[]
}
export interface DuplicateItineraryResponse extends CustomFetchBaseResponse {
  duplicatedItinerary: ItineraryData
}

export interface ItineraryData {
  id: string
  userId: string
  title: string
  description?: string
  coverImage: string
  startDate: string // ISO string format (e.g., "2025-03-02T12:00:00Z")
  endDate: string
  isPublished: boolean
  isCompleted: boolean
  locationCount: number
  pendingInvites: {
    createdAt: string // ISO string format (e.g., "2025-03-31T09:07:34.592Z")
    email: string
    id: string
    itineraryId: string
    updatedAt: string
  }[]
  invitedUsers: {
    id: string
    firstName: string
    lastName: string
    photoProfile: string
    email: string
  }[]
}
