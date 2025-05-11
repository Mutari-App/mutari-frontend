'use client'

import React, { useEffect, useState } from 'react'
import ItineraryCardSkeleton from '@/modules/HomePageModule/module-elements/ItineraryCardSkeleton'
import { customFetch } from '@/utils/newCustomFetch'

interface RecentlyViewedSectionProps<T> {
  title: string
  fetchEndpoint: string
  mapData: (data: any) => T[]
  renderCard: (item: T) => React.ReactNode
  emptyMessage: string
}

function RecentlyViewedSection<T>({
  title,
  fetchEndpoint,
  mapData,
  renderCard,
  emptyMessage,
}: RecentlyViewedSectionProps<T>) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await customFetch(fetchEndpoint)
        setItems(mapData(response))
      } catch (error) {
        console.error(`Error fetching data from ${fetchEndpoint}:`, error)
      } finally {
        setLoading(false)
      }
    }
    void fetchData()
  }, [fetchEndpoint, mapData])

  return (
    <section className="flex flex-col justify-start gap-7 w-4/5">
      <h2 className="font-semibold text-2xl md:text-left md:text-[36px] sel">
        {title}
      </h2>
      {loading ? (
        <div className="flex gap-5 w-full overflow-auto">
          <ItineraryCardSkeleton />
          <ItineraryCardSkeleton />
          <ItineraryCardSkeleton />
        </div>
      ) : (
        <div className="flex gap-5 w-full overflow-auto pb-5 justify-start items-stretch">
          {items.length > 0 ? (
            items.map((item, index) => <React.Fragment key={index}>{renderCard(item)}</React.Fragment>)
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full gap-5 p-5 text-center bg-white rounded-lg shadow-md">
              <p className="text-gray-500">{emptyMessage}</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default RecentlyViewedSection