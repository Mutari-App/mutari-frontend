export interface ProfileProps {
  id: string
  photoProfile: string | null
  firstName: string
  lastName: string
  referralCode: string
  loyaltyPoints: number
  totalReferrals: number
  totalItineraries: number
  totalLikes: number
}

export interface ProfileModuleProps {
  profile: ProfileProps
}

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

export interface GetItinerariesProps {
  itineraries: ItineraryProps[]
}

export interface GetItineraryLikesProps {
  itineraryLikes: ItineraryProps[]
}
