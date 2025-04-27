import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ItineraryCard from '@/modules/ItinerarySearchResultsModule/module-elements/ItineraryCard'
import SearchBar from '@/modules/ItinerarySearchResultsModule/module-elements/SearchBar'
import { customFetch } from '@/utils/newCustomFetch'
import {
  type ItinerarySearchResult,
  type SearchItinerariesResponse,
} from '@/modules/ItinerarySearchResultsModule/interface'
import { Button } from '@/components/ui/button'
import { v4 } from 'uuid'

const ExploreItinerarySection = () => {
  const router = useRouter()
  const [itineraries, setItineraries] = useState<ItinerarySearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setIsLoading(true)
        const response = await customFetch<SearchItinerariesResponse>(
          '/itineraries/search?page=1&limit=8',
          { method: 'GET' }
        )
        setItineraries(response.data || [])
      } catch (error) {
        console.error('Failed to fetch itineraries:', error)
        setItineraries([])
      } finally {
        setIsLoading(false)
      }
    }

    void fetchItineraries()
  }, [])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/itinerary/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleViewMore = () => {
    router.push('/itinerary/search')
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 mb-4 sm:mb-8 container mx-auto px-4">
      <p className="sm:text-xl md:text-2xl font-semibold">
        Buka, Duplikasi, dan Edit Sesuai Maumu!
      </p>
      <SearchBar
        initialValue=""
        onSearch={handleSearch}
        className="max-w-7xl border border-[#0073E6] rounded-full"
        searchHistoryDropdownPadding="md:p-2"
      />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`${index}-${v4()}`}
              className="h-64 sm:h-72 rounded-md bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="p-2 sm:p-4 border border-[#0073E6] rounded-xl shadow-gray-300 shadow-lg grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
            {itineraries &&
              itineraries.length > 0 &&
              itineraries.map((itinerary) => (
                <ItineraryCard key={itinerary.id} itinerary={itinerary} />
              ))}
          </div>
          {itineraries && itineraries.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={handleViewMore}
                variant="outline"
                size="sm"
                className="rounded-full px-6 border-[#0073E6] text-[#014285] hover:bg-blue-50"
              >
                Lihat Lebih Banyak
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ExploreItinerarySection
