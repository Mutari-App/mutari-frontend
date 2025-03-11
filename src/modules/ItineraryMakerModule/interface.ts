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
