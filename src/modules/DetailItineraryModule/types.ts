interface Block {
  updatedAt: string
  createdAt: string
  id: string
  sectionId: string
  position: number
  blockType: string
  title: string
  description: string
  startTime: string
  endTime: string
  location: string
  price: number
  photoUrl: string | null
}

interface Section {
  updatedAt: string
  createdAt: string
  id: string
  itineraryId: string
  sectionNumber: number
  title: string
  blocks: Block[]
}

interface Itinerary {
  updatedAt: string
  createdAt: string
  id: string
  userId: string
  title: string
  description: string
  coverImage: string
  startDate: string
  endDate: string
  isPublished: boolean
  isCompleted: boolean
  sections: Section[]
}

interface ItineraryDetailResponse {
  statusCode: number
  success: boolean
  message: string
  data: Itinerary
}
