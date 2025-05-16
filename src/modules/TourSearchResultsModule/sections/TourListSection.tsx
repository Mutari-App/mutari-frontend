import React from 'react'
import TourCard from '../module-elements/TourCard'
import ListSection from '@/components/ListSection'
import { type TourSearchResult } from '../interface'

interface TourListSectionProps {
  tours: TourSearchResult[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  totalResults: number
  onPageChange: (page: number) => void
  searchQuery: string
  onResetSearch: () => void
}

const TourListSection: React.FC<TourListSectionProps> = ({
  tours,
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
      items={tours}
      renderItem={(tour) => <TourCard key={tour.id} tour={tour} />}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      totalResults={totalResults}
      onPageChange={onPageChange}
      searchQuery={searchQuery}
      onResetSearch={onResetSearch}
      searchType="tur"
    />
  )
}

export default TourListSection
