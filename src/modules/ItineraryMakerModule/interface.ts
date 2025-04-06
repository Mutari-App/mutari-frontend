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
    blockIndex: number
    blockType: 'LOCATION' | 'NOTE'
    field?: 'startTime' | 'endTime' | 'price' | 'description' | 'title'
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
}

export interface PlaceDetails {
  html_attributions: string[]
  result: PlaceResult
}
