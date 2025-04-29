import type { CustomFetchBaseResponse } from '@/utils/customFetch/interface'
import type { ItineraryData } from '../ItineraryModule/module-elements/types'
import { ItinerarySearchResult } from '../ItinerarySearchResultsModule/interface'

export interface RecentlyViewedItineraryResponse
  extends CustomFetchBaseResponse {
  itineraries: RecentlyViewedItineraries[]
}

export interface RecentlyViewedItineraries {
  createdAt: string
  id: string
  itinerary: ItineraryData
  itineraryId: string
  updatedAt: string
  userId: string
  viewedAt: string
}

export interface DiscoverItinerariesByTagResponse
  extends CustomFetchBaseResponse {
  itineraries: ItinerarySearchResult[]
}
