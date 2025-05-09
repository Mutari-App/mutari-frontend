'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ItineraryCard from '@/modules/ItinerarySearchResultsModule/module-elements/ItineraryCard'
import { customFetch, customFetchBody } from '@/utils/newCustomFetch'
import {
  BatchCheckItinerarySavedResponse,
  type ItinerarySearchResult,
  type SearchItinerariesResponse,
} from '@/modules/ItinerarySearchResultsModule/interface'
import { Button } from '@/components/ui/button'
import { v4 } from 'uuid'
import { DiscoverItinerariesByTagResponse } from '../interface'
import { toast } from 'sonner'

const ExploreItinerarySection = () => {
  const router = useRouter()
  const [itineraries, setItineraries] = useState<ItinerarySearchResult[]>([])
  const [itinerariesByTag, setItinerariesByTag] = useState<
    ItinerarySearchResult[]
  >([])
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  const [likedItineraries, setLikedItineraries] = useState<{
    [key: string]: boolean
  }>({})
  const [isLoadingPopular, setIsLoadingPopular] = useState(true)
  const [isLoadingTag, setIsLoadingTag] = useState(true)

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setIsLoadingPopular(true)
        const response = await customFetch<SearchItinerariesResponse>(
          '/itineraries/search?page=1&limit=8',
          { method: 'GET' }
        )
        setItineraries(response.data || [])
      } catch (error) {
        console.error('Failed to fetch itineraries:', error)
        setItineraries([])
      } finally {
        setIsLoadingPopular(false)
      }
    }

    const fetchExploreItinerariesByTag = async () => {
      try {
        setIsLoadingTag(true)
        const response = await customFetch<DiscoverItinerariesByTagResponse>(
          '/itineraries/me/explore-by-latest-tags',
          { method: 'GET' }
        )
        setItinerariesByTag(response.itineraries || [])
      } catch (error) {
        console.error('Failed to fetch itineraries:', error)
        setItinerariesByTag([])
      } finally {
        setIsLoadingTag(false)
      }
    }

    void fetchItineraries()
    void fetchExploreItinerariesByTag()
  }, [])

  useEffect(() => {
    const fetchLikedItineraries = async () => {
      try {
        setIsLoadingPopular(true)
        setIsLoadingTag(true)
        const popularItineraryIds = itineraries.map((itinerary) => itinerary.id)
        const tagItineraryIds = itinerariesByTag.map(
          (itinerary) => itinerary.id
        )
        const itineraryIds = [...popularItineraryIds, ...tagItineraryIds]
        const response = await customFetch<BatchCheckItinerarySavedResponse>(
          `/itineraries/checkSave`,
          {
            method: 'POST',
            body: customFetchBody(itineraryIds),
            credentials: 'include',
          }
        )
        setLikedItineraries(response.result)
      } catch (error) {
        toast.error('Gagal memuat eksplorasi itinerary')
        setItineraries([])
        setLikedItineraries({})
        setItinerariesByTag([])
        console.error(error)
      } finally {
        setIsLoadingPopular(false)
        setIsLoadingTag(false)
      }
    }

    void fetchLikedItineraries()
  }, [itineraries, itinerariesByTag])

  const handleViewMore = () => {
    router.push('/itinerary/search')
  }

  return (
    <section className="flex flex-col justify-start gap-7 w-4/5">
      <p className="font-semibold text-2xl md:text-left md:text-[36px] md:text-left  self-start">
        Eksplorasi
      </p>
      {isLoadingPopular ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`${index}-${v4()}`}
              className="h-64 sm:h-72 rounded-md bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div>
          <p className="sm:text-xl md:text-2xl font-semibold">
            Banyak di-like orang
          </p>
          <div className="p-2 sm:p-4 border border-[#0073E6] rounded-xl shadow-gray-300 shadow-lg grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
            {itineraries &&
              itineraries.length > 0 &&
              itineraries.map((itinerary) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  isLiked={likedItineraries[itinerary.id] ?? false}
                />
              ))}
          </div>
        </div>
      )}

      {isLoadingTag ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`${index}-${v4()}`}
              className="h-64 sm:h-72 rounded-md bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : (
        itinerariesByTag &&
        itinerariesByTag.length > 0 && (
          <div>
            <p className="sm:text-xl md:text-2xl font-semibold">
              Perjalanan lain yang mungkin Anda suka
            </p>
            <div className="p-2 sm:p-4 border border-[#0073E6] rounded-xl shadow-gray-300 shadow-lg grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
              {itinerariesByTag &&
                itinerariesByTag.length > 0 &&
                itinerariesByTag.map((itinerary) => (
                  <ItineraryCard
                    key={itinerary.id}
                    itinerary={itinerary}
                    isLiked={likedItineraries[itinerary.id] ?? false}
                  />
                ))}
            </div>
          </div>
        )
      )}
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
    </section>
  )
}

export default ExploreItinerarySection
