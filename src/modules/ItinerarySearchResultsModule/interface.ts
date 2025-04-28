import { type CustomFetchBaseResponse } from '@/utils/customFetch/interface'

export interface UserInfo {
  id: string
  firstName: string
  lastName?: string
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
  createdAt: string
  title: string
  description?: string | null
  coverImage?: string | null
  user: UserInfo
  tags: ItineraryTag[]
  daysCount: number
  likes: number
}

export interface SearchMetadata {
  total: number
  page: number
  totalPages: number
}

export interface SearchItinerariesResponse extends CustomFetchBaseResponse {
  data: ItinerarySearchResult[]
  metadata: SearchMetadata
}

export interface ItineraryFilters {
  tags: string
  minDaysCount?: string
  maxDaysCount?: string
  sortBy: '' | 'createdAt' | 'likes' | 'daysCount'
  order: '' | 'asc' | 'desc'
}
