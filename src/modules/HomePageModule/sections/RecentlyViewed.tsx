'use client'

import React, { useEffect, useState } from 'react'
import ItineraryCard from '@/modules/ItinerarySearchResultsModule/module-elements/ItineraryCard'
import { customFetch, customFetchBody } from '@/utils/newCustomFetch'
import RecentlyViewedSection from '@/modules/TourMarketplaceModule/sections/RecentlyViewedSection'
import {
  type RecentlyViewedItineraries,
  type RecentlyViewedItineraryResponse,
} from '../interface'
import { type BatchCheckItinerarySavedResponse } from '@/modules/ItinerarySearchResultsModule/interface'

function RecentlyViewed() {
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  const [itinerariesLiked, setItinerariesLiked] = useState<{
    [key: string]: boolean
  }>({})

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        const response =
          await customFetch<RecentlyViewedItineraryResponse>(
            '/itineraries/views'
          )

        const itineraryIds = response.itineraries.map(
          (itinerary) => itinerary.id
        )
        const responseLikes =
          await customFetch<BatchCheckItinerarySavedResponse>(
            `/itineraries/checkSave`,
            {
              method: 'POST',
              body: customFetchBody(itineraryIds),
            }
          )
        setItinerariesLiked(responseLikes.result)
      } catch (error) {
        console.error('Error fetching recently viewed itineraries:', error)
      }
    }
    void fetchRecentlyViewed()
  }, [])

  return (
    <RecentlyViewedSection
      title="Baru Dilihat"
      fetchEndpoint="/itineraries/views"
      mapData={(data: RecentlyViewedItineraryResponse) => data.itineraries}
      renderCard={(itinerary: RecentlyViewedItineraries) => (
        <ItineraryCard
          key={itinerary.id}
          itinerary={itinerary}
          isLiked={itinerariesLiked[itinerary.id]}
          className="w-1/5 min-w-[250px]"
        />
      )}
      emptyMessage="Tidak ada itinerary yang baru dilihat."
    />
  )
}

export default RecentlyViewed
