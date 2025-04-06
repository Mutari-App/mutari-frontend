import { type CustomFetchBaseResponse } from '@/utils/customFetch/interface'

export interface Block {
  id: string
  blockType: string
  title: string
  description?: string
  startTime?: string
  endTime?: string
  location?: string
  price?: number
  photoUrl?: string
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
