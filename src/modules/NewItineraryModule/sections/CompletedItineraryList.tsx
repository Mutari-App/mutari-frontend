'use client'
import React, { useState } from 'react'
import ItineraryCard from '../module-elements/ItineraryCard'
import type { ItineraryData } from '../module-elements/types'
import { PaginationClient } from '../module-elements/PaginationClient'

function CompletedItineraryList({
  data,
  refresh,
}: {
  readonly data: readonly Readonly<ItineraryData>[]
  readonly refresh: () => void
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const LIMIT_PER_PAGE = 3
  const skipped = LIMIT_PER_PAGE * (currentPage - 1)
  const lastData = Math.min(skipped + LIMIT_PER_PAGE, data.length)
  const displayedData = data.length > 0 ? data.slice(skipped, lastData) : []
  const metadata = {
    page: currentPage,
    totalPages: Math.ceil(data.length / LIMIT_PER_PAGE),
    total: data.length,
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {displayedData.map((item) => (
            <ItineraryCard item={item} key={item.id} refresh={refresh} />
          ))}
        </div>
      ) : (
        <div className="w-full flex items-center justify-center py-8">
          Belum ada perjalanan yang selesai.
        </div>
      )}
      <PaginationClient {...metadata} setPage={setCurrentPage} />
    </div>
  )
}

export default CompletedItineraryList
