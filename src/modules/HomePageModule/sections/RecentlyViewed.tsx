'use client'

import { customFetch } from '@/utils/customFetch'
import React, { useEffect, useState } from 'react'
import type {
  RecentlyViewedItineraries,
  RecentlyViewedItineraryResponse,
} from '../interface'
import ViewedItineraryCard from '../module-elements/ViewedItineraryCard'
import ItineraryCard from '@/modules/ItinerarySearchResultsModule/module-elements/ItineraryCard'
import { useAuthContext } from '@/contexts/AuthContext'
import { customFetchBody } from '@/utils/newCustomFetch'
import { BatchCheckItinerarySavedResponse } from '@/modules/ItinerarySearchResultsModule/interface'

function RecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<
    RecentlyViewedItineraries[]
  >([])
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  const [itinerariesLiked, setItinerariesLiked] = useState<{
    [key: string]: boolean
  }>({})
  const { isAuthenticated } = useAuthContext()
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        setLoading(true)
        const response =
          await customFetch<RecentlyViewedItineraryResponse>(
            '/itineraries/views'
          )
        setRecentlyViewed(response.itineraries)

        const itineraryIds = response.itineraries.map(
          (itinerary) => itinerary.id
        )
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
        console.error('Error fetching recently viewed itineraries:', error)
      } finally {
        setLoading(false)
      }
    }
    void fetchRecentlyViewed()
  }, [])
  return (
    <section className="flex flex-col justify-start gap-7 w-4/5">
      <h2 className="font-semibold text-2xl md:text-left md:text-[36px] sel">
        Baru Dilihat
      </h2>
      <div className="flex gap-5 w-full overflow-auto pb-5 justify-start items-stretch">
        {recentlyViewed.length > 0 ? (
          recentlyViewed.map((viewed) => (
            <ItineraryCard
              key={viewed.id}
              itinerary={viewed}
              isLiked={itinerariesLiked[viewed.id]}
              className="w-1/5 min-w-[250px]"
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full gap-5 p-5 text-center bg-white rounded-lg shadow-md">
            <p className="text-gray-500">
              Tidak ada itinerary yang baru dilihat.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default RecentlyViewed
