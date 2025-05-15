import React, { useState } from 'react'
import SearchBar from '@/modules/ItinerarySearchResultsModule/module-elements/SearchBar'
import FilterButton from '@/modules/ItinerarySearchResultsModule/module-elements/FilterButton'
import FilterModal from '../module-elements/FilterModal'
import { type TourFilters } from '../interface'
import { getImage } from '@/utils/getImage'

interface HeaderSectionProps {
  searchQuery: string
  onSearch: (query: string) => void
  filters: TourFilters
  onFilterChange: (filters: TourFilters) => void
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  searchQuery,
  onSearch,
  filters,
  onFilterChange,
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const hasFilters =
    !!filters.location ||
    !!filters.minPrice ||
    !!filters.maxPrice ||
    !!filters.minDuration ||
    !!filters.maxDuration ||
    !!filters.durationType ||
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    filters.hasAvailableTickets ||
    filters.sortBy !== '' ||
    filters.order !== ''

  return (
    <div
      className="relative py-6 sm:py-8 md:py-10 lg:py-14 bg-cover bg-center"
      style={{
        backgroundImage: `url(${getImage('Header_SRP_Tour.png')})`,
      }}
    >
      <div className="container relative mx-auto flex flex-col items-center justify-center px-4 z-10 pt-20">
        <div className="w-full flex flex-nowrap items-center justify-center gap-2 sm:gap-3 max-w-xl">
          <SearchBar
            initialValue={searchQuery}
            onSearch={onSearch}
            className="flex-grow w-full sm:w-auto sm:flex-1"
            placeholder="Cari Tiket Tur..."
            searchType="tour"
          />
          <FilterButton
            onClick={() => setIsFilterModalOpen(true)}
            filtersApplied={hasFilters}
          />
        </div>
        <FilterModal
          open={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filters={filters}
          onApplyFilters={onFilterChange}
        />
      </div>
    </div>
  )
}

export default HeaderSection
