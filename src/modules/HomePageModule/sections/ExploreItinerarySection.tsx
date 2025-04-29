'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ItineraryCard from '@/modules/ItinerarySearchResultsModule/module-elements/ItineraryCard'
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
    <section className="flex flex-col justify-start gap-7 w-4/5">
      <p className="font-semibold text-2xl md:text-left md:text-[36px] md:text-left  self-start">
        Eksplorasi
      </p>
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
          <div>
            <p className="sm:text-xl md:text-2xl font-semibold">
              Banyak di-like orang
            </p>
            <div className="p-2 sm:p-4 border border-[#0073E6] rounded-xl shadow-gray-300 shadow-lg grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
              {itineraries &&
                itineraries.length > 0 &&
                itineraries.map((itinerary) => (
                  <ItineraryCard
                    isLiked={false}
                    key={itinerary.id}
                    itinerary={itinerary}
                  />
                ))}
            </div>
          </div>
          {itineraries && itineraries.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={handleViewMore}
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-[#016CD7] to-[#014285] text-white items-center flex gap-3 w-full md:w-3/4 lg:w-1/2"
              >
                Lihat Lebih Banyak
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default ExploreItinerarySection
