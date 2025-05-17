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
  photoUrl: string | undefined
  routeToNext?: Route
  routeFromPrevious?: Route
}

interface Section {
  updatedAt: string
  createdAt: string
  id: string
  itineraryId: string
  sectionNumber: number
  contingencyPlanId: string | null
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
  tags: {
    tag: Tag
  }[]
  isPublished: boolean
  isCompleted: boolean
  sections: Section[]
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
  user: {
    id: string
    firstName: string
    lastName: string
    photoProfile: string | null
  }
  _count: {
    likes: number
  }
}

interface Tour {
  id: string
  title: string
  coverImage: string
  maxCapacity: number
  description: string
  location: string
  pricePerTicket: number
  duration: number
  durationType: 'DAY' | 'HOUR'
  itineraryId: string
  createdAt: string
  updatedAt: string
  itinerary: Itinerary
  includes: Include[]
}

interface Include {
  id: number
  tourid: number
  icon: string
  text: string
}

interface TourDetailResponse {
  statusCode: number
  success: boolean
  message: string
  data: Tour
}
