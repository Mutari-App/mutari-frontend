'use client'
import React from 'react'
import type { ItineraryData } from '../module-elements/types'
import TrendingItineraryCard from '../module-elements/TrendingItineraryCard'

function TrendingItineraryList({
  data,
}: {
  readonly data: readonly Readonly<ItineraryData>[]
}) {
  return (
    <div className="flex flex-col gap-8 w-full">
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {data.map((item) => (
            <TrendingItineraryCard item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <div className="w-full flex items-center justify-center py-8">
          Belum ada perjalanan yang trending.
        </div>
      )}
    </div>
  )
}

export default TrendingItineraryList
