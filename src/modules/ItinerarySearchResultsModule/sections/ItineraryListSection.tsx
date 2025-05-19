import React from 'react'
import ItineraryCard from '../module-elements/ItineraryCard'
import ListSection from '@/components/ListSection'
import { type ItinerarySearchResult } from '../interface'

interface ItineraryListSectionProps {
  itineraries: ItinerarySearchResult[]
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  itinerariesLiked: { [key: string]: boolean }
  isLoading: boolean
  currentPage: number
  totalPages: number
  totalResults: number
  onPageChange: (page: number) => void
  searchQuery: string
  onResetSearch: () => void
}

const ItineraryListSection: React.FC<ItineraryListSectionProps> = ({
  itineraries,
  itinerariesLiked,
  isLoading,
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
  searchQuery,
  onResetSearch,
}) => {
  return (
    <ListSection
      items={itineraries}
      renderItem={(itinerary) => (
        <ItineraryCard
          key={itinerary.id}
          itinerary={itinerary}
          isLiked={itinerariesLiked ? itinerariesLiked[itinerary.id] : false}
        />
      )}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      totalResults={totalResults}
      onPageChange={onPageChange}
      searchQuery={searchQuery}
      onResetSearch={onResetSearch}
    />
  )
}

export default ItineraryListSection
