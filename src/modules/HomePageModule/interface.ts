import type { CustomFetchBaseResponse } from '@/utils/customFetch/interface'
import { type ItinerarySearchResult } from '../ItinerarySearchResultsModule/interface'
import type {
  ItineraryTag,
  UserInfo,
} from '../ItinerarySearchResultsModule/interface'

export interface RecentlyViewedItineraryResponse
  extends CustomFetchBaseResponse {
  itineraries: RecentlyViewedItineraries[]
}

export interface RecentlyViewedItineraries {
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

export interface DiscoverItinerariesByTagResponse
  extends CustomFetchBaseResponse {
  itineraries: ItinerarySearchResult[]
}
