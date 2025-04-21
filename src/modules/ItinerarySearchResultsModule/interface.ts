import { type CustomFetchBaseResponse } from '@/utils/customFetch/interface'

export interface UserInfo {
  id: string
  firstName: string
  lastName: string
  photoProfile?: string | null
}

export interface Tag {
  id: string
  name: string
}

export interface ItineraryTag {
  tag: Tag
}

export interface ItinerarySearchResult {
  id: string
  title: string
  description?: string | null
  coverImage?: string | null
  startDate: string
  endDate: string
  createdAt: string
  user: UserInfo
  tags: ItineraryTag[]
  locationCount: number
  likes: number
}

export interface SearchMetadata {
  total: number
  page: number
  totalPages: number
}

export interface SearchItinerariesResponse extends CustomFetchBaseResponse {
  data: {
    data: ItinerarySearchResult[]
    metadata: SearchMetadata
  }
}

export interface ItineraryFilters {
  tags: string
  startDate: string
  endDate: string
  sortBy: 'startDate' | 'endDate' | 'createdAt' | 'likes' | 'locationCount'
  order: 'asc' | 'desc'
}
