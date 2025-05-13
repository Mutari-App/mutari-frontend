import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ItineraryCard from '@/modules/ItinerarySearchResultsModule/module-elements/ItineraryCard'
import SearchBar from '@/modules/ItinerarySearchResultsModule/module-elements/SearchBar'
import { customFetch, customFetchBody } from '@/utils/newCustomFetch'
import {
  type BatchCheckItinerarySavedResponse,
  type ItinerarySearchResult,
  type SearchItinerariesResponse,
} from '@/modules/ItinerarySearchResultsModule/interface'
import { Button } from '@/components/ui/button'
import { v4 } from 'uuid'
import { useAuthContext } from '@/contexts/AuthContext'
import Link from 'next/link'

const ExploreItinerarySection = () => {
  const router = useRouter()
  const { isAuthenticated } = useAuthContext()
  const [itineraries, setItineraries] = useState<ItinerarySearchResult[]>([])
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  const [itinerariesLiked, setItinerariesLiked] = useState<{
    [key: string]: boolean
  }>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setIsLoading(true)
        const response = await customFetch<SearchItinerariesResponse>(
          '/itineraries/search?page=1&limit=8',
          { method: 'GET' }
        )

        const itineraryIds = response.data.map((itinerary) => itinerary.id)
        setItineraries(response.data || [])

        if (isAuthenticated) {
          const responseLikes =
            await customFetch<BatchCheckItinerarySavedResponse>(
              `/itineraries/checkSave`,
              {
                method: 'POST',
                body: customFetchBody(itineraryIds),
              }
            )
          setItinerariesLiked(responseLikes.result)
        }
      } catch (error) {
        console.error('Failed to fetch itineraries:', error)
        setItineraries([])
      } finally {
        setIsLoading(false)
      }
    }

    void fetchItineraries()
  }, [isAuthenticated])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/itinerary/search?q=${encodeURIComponent(query)}`)
    }
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
        variant="iconLeft"
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
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  isLiked={itinerariesLiked[itinerary.id]}
                />
              ))}
          </div>
          {itineraries && itineraries.length > 0 && (
            <Link
              href={'/itinerary/search'}
              className="w-full md:w-3/4 lg:w-1/2 mx-auto flex justify-center"
            >
              <div className="p-[1.5px] flex w-full items-center bg-gradient-to-r from-[#0073E6] to-[#004080] hover:from-[#0066cc] hover:to-[#003366] rounded-lg group">
                <Button className="h-8 w-full bg-white group-hover:bg-transparent">
                  <span className="bg-gradient-to-r from-[#0073E6] to-[#004080] group-hover:text-white text-transparent bg-clip-text flex items-center">
                    Lihat Lebih Banyak
                  </span>
                </Button>
              </div>
            </Link>
          )}
        </>
      )}
    </div>
  )
}

export default ExploreItinerarySection
