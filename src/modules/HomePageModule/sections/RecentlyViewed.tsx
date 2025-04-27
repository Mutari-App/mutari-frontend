'use client'

import { customFetch } from '@/utils/customFetch'
import React, { useEffect } from 'react'
import type {
  RecentlyViewedItineraries,
  RecentlyViewedItineraryResponse,
} from '../interface'
import ViewedItineraryCard from '../module-elements/ViewedItineraryCard'

function RecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = React.useState<
    RecentlyViewedItineraries[]
  >([])
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      setLoading(true)
      try {
        const response =
          await customFetch<RecentlyViewedItineraryResponse>(
            '/itineraries/views'
          )
        if (response.success) {
          setRecentlyViewed(response.itineraries)
          console.log(response.itineraries)
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
    <div className="flex flex-col justify-start gap-7 w-4/5">
      <h2 className="font-semibold text-2xl md:text-left md:text-[36px] sel">
        Baru Dilihat
      </h2>
      <div className="flex gap-5 w-full overflow-auto pb-5">
        {recentlyViewed.length > 0 ? (
          recentlyViewed.map((viewed) => (
            <ViewedItineraryCard key={viewed.id} item={viewed.itinerary} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full gap-5 p-5 text-center bg-white rounded-lg shadow-md">
            <p className="text-gray-500">
              Tidak ada itinerary yang baru dilihat.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecentlyViewed
