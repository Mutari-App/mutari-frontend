'use client'
import React from 'react'
import ItineraryCard from '../module-elements/ItineraryCard'
import type { ItineraryData } from '../module-elements/types'

function CompletedItineraryList({
  data,
  refresh,
}: {
  readonly data: readonly Readonly<ItineraryData>[]
  readonly refresh: () => void
}) {
  return (
    <div className="flex flex-col gap-8 w-full">
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {data.map((item) => (
            <ItineraryCard item={item} key={item.id} refresh={refresh} />
          ))}
        </div>
      ) : (
        <div className="w-full flex items-center justify-center py-8">
          Belum ada perjalanan yang selesai.
        </div>
      )}
    </div>
  )
}

export default CompletedItineraryList
