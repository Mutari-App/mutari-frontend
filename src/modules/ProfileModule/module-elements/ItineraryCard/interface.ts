export interface ItineraryProps {
  id: string
  title: string
  description: string | null
  coverImage?: string | null
  startDate: string
  endDate: string
  totalLikes: number
  totalDestinations: number
}
