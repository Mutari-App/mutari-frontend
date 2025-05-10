'use client'

import { customFetch } from '@/utils/customFetch'
import React, { useEffect, useState } from 'react'
import type { RecentlyViewedTourResponse, TourView } from '../interface'
import ItineraryCardSkeleton from '@/modules/HomePageModule/module-elements/ItineraryCardSkeleton'
import TourCard from '../module-elements/TourCard'

function RecentlyViewedTour() {
  const [recentlyViewed, setRecentlyViewed] = useState<TourView[]>([])
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        setLoading(true)
        const response =
          await customFetch<RecentlyViewedTourResponse>('/tour/views')
        setRecentlyViewed(response.tours)
      } catch (error) {
        console.error('Error fetching recently viewed tours:', error)
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
      {loading ? (
        <div className="flex gap-5 w-full overflow-auto">
          <ItineraryCardSkeleton />
          <ItineraryCardSkeleton />
          <ItineraryCardSkeleton />
        </div>
      ) : (
        <div className="flex gap-5 w-full overflow-auto pb-5 justify-start items-stretch">
          {recentlyViewed.length > 0 ? (
            recentlyViewed.map((viewed) => (
              <TourCard tour={viewed.tour} key={viewed.id} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full gap-5 p-5 text-center bg-white rounded-lg shadow-md">
              <p className="text-gray-500">Tidak ada tour yang baru dilihat.</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default RecentlyViewedTour
