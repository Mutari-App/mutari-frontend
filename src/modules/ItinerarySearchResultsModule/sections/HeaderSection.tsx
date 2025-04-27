import React, { useState, useEffect } from 'react'
import SearchBar from '../module-elements/SearchBar'
import FilterButton from '../module-elements/FilterButton'
import FilterModal from '../module-elements/FilterModal'
import { type ItineraryFilters } from '../interface'
import { customFetch } from '@/utils/newCustomFetch'
import { getImage } from '@/utils/getImage'

interface HeaderSectionProps {
  searchQuery: string
  onSearch: (query: string) => void
  filters: ItineraryFilters
  onFilterChange: (filters: ItineraryFilters) => void
}

interface Tag {
  id: string
  name: string
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  searchQuery,
  onSearch,
  filters,
  onFilterChange,
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [availableTags, setAvailableTags] = useState<
    { id: string; name: string }[]
  >([])

  const hasFilters =
    !!filters.tags ||
    !!filters.minDaysCount ||
    !!filters.maxDaysCount ||
    filters.sortBy !== '' ||
    filters.order !== ''

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await customFetch<{ tags: Tag[] }>(
          '/itineraries/tags',
          { method: 'GET' }
        )
        if (response.tags) {
          setAvailableTags(response.tags)
        }
      } catch (error) {
        console.error('Failed to fetch tags:', error)
      }
    }
    void fetchTags()
  }, [])

  return (
    <div
      className="relative py-6 sm:py-8 md:py-10 lg:py-14 bg-cover bg-center"
      style={{
        backgroundImage: `url(${getImage('Header_SRP_Itinerary.png')})`,
      }}
    >
      <div className="container relative mx-auto flex flex-col items-center justify-center px-4 z-10 pt-20">
        <div className="w-full flex flex-nowrap items-center justify-center gap-2 sm:gap-3 max-w-xl">
          <SearchBar
            initialValue={searchQuery}
            onSearch={onSearch}
            className="flex-grow w-full sm:w-auto sm:flex-1"
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
          availableTags={availableTags}
        />
      </div>
    </div>
  )
}

export default HeaderSection
