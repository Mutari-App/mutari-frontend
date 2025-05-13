'use client'
import React, { useState, useEffect } from 'react'
import ItineraryCard from '@/modules/ItinerarySearchResultsModule/module-elements/ItineraryCard'
import { customFetch, customFetchBody } from '@/utils/newCustomFetch'
import {
  type BatchCheckItinerarySavedResponse,
  type ItinerarySearchResult,
  type SearchItinerariesResponse,
} from '@/modules/ItinerarySearchResultsModule/interface'
import { Button } from '@/components/ui/button'
import { v4 } from 'uuid'
import { type DiscoverItinerariesByTagResponse } from '../interface'
import { toast } from 'sonner'
import Link from 'next/link'

const ExploreItinerarySection = () => {
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

  return (
    <section className="flex flex-col justify-start gap-7 w-4/5">
      <p className="font-semibold text-2xl md:text-left md:text-[36px] self-start">
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
    </section>
  )
}

export default ExploreItinerarySection
