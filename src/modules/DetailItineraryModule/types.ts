enum TransportMode {
  DRIVE = 'DRIVE',
  WALK = 'WALK',
  BICYCLE = 'BICYCLE',
  TRANSIT = 'TRANSIT',
  TWO_WHEELER = 'TWO_WHEELER',
}

interface Route {
  id: string
  createdAt: string
  updatedAt: string
  sourceBlockId: string
  destinationBlockId: string
  distance: number
  duration: number
  polyline?: string
  transportMode: TransportMode
}

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

interface Tag {
  id: string
  name: string
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
}

interface ItineraryDetailResponse {
  statusCode: number
  success: boolean
  message: string
  data: Itinerary
}

interface ItineraryReminder {
  updatedAt: string
  createdAt: string
  id: string
  itineraryId: string
  recipient: string
  recipientName: string
  tripName: string
  startDate: string
  reminderOption: string
}

interface ItineraryReminderResponse {
  statusCode: number
  success: boolean
  message: string
  data: ItineraryReminder
}

interface ContingencyPlan {
  id: string
  createdAt: string
  updatedAt: string
  itineraryId: string
  title: string
  description: string
  isSelected: boolean
  sections: Section[]
}

interface ContingencyPlansResponse {
  statusCode: number
  success: boolean
  message: string
  contingencies: ContingencyPlan[]
}

interface ContingencyPlanResponse {
  statusCode: number
  success: boolean
  message: string
  contingency: ContingencyPlan
}
