import { type CustomFetchBaseResponse } from '@/utils/customFetch/interface'
import { type TransportMode } from '@/utils/maps'

export interface Block {
  id: string
  blockType: string
  title: string
  description?: string
  startTime?: string
  endTime?: string
  location?: string
  price?: number
  routeToNext?: Route
  routeFromPrevious?: Route
}

export interface Route {
  sourceBlockId: string
  destinationBlockId: string
  distance: number // Distance in meters
  duration: number // Duration in seconds
  polyline?: string
  transportMode?: TransportMode
}

export interface Section {
  sectionNumber: number
  title?: string
  blocks?: Block[]
}

export interface CreateItineraryDto {
  title: string
  description?: string
  coverImage?: string
  startDate: string
  endDate: string
  tags?: string[]
  sections: Section[]
}

export interface Tag {
  id: string
  name: string
}

export interface CreateItineraryResponse extends CustomFetchBaseResponse {
  id: string
  userId: string
  title: string
  description?: string
  coverImage?: string
  startDate: string
  endDate: string
  tags: {
    tag: Tag
  }[]
  sections: {
    id: string
    sectionNumber: number
    title: string
    blocks: {
      id: string
      position: number
      blockType: string
      title: string
      description?: string
      startTime?: string
      endTime?: string
      location?: string
      price: number
      photoUrl?: string
    }[]
  }[]
}

export interface FeedbackItem {
  target: {
    sectionIndex: number
    blockId: string
    blockType: 'LOCATION' | 'NOTE'
    field?: 'time' | 'price' | 'description' | 'title'
  }
  suggestion: string
}

export interface GetPlaceDetailsResponse extends CustomFetchBaseResponse {
  details: PlaceDetails
}
export interface Photo {
  height: number
  html_attributions: string[]
  photo_reference: string
  width: number
}

export interface PlaceResult {
  name: string
  photos: Photo[]
  rating: number
  user_ratings_total: number
  vicinity?: string
  international_phone_number?: string
  website?: string
  priceRange?: {
    startPrice?: number
    endPrice?: number
  }
}

export interface PlaceDetails {
  html_attributions: string[]
  result: PlaceResult
}

export interface ItineraryReminderDto {
  itineraryId: string
  recipient?: string
  recipientName?: string
  tripName?: string
  startDate: string
  reminderOption: string
}

export interface CreateItineraryReminderResponse
  extends CustomFetchBaseResponse {
  id: string
  updatedAt: string
  createdAt: string
  itineraryId: string
  recipient: string
  recipientName: string
  tripName: string
  startDate: string
  reminderOption: string
}

export interface ReminderOption {
  label: string
  value: 'NONE' | 'TEN_MINUTES_BEFORE' | 'ONE_HOUR_BEFORE' | 'ONE_DAY_BEFORE'
  available: boolean
}

export interface ItineraryMakerModuleProps {
  isContingency?: boolean
  isEdit?: boolean
}

export interface ContingencyPlanDto {
  id: string
  itineraryId: string
  title: string
  description?: string
  sections: Section[]
}

export interface ContingencyPlanResponse extends CustomFetchBaseResponse {
  contingency: ContingencyPlanDto[]
}

export interface ILocationMarker {
  lat: number
  lng: number
  section: number
  order: number
  title: string
}
