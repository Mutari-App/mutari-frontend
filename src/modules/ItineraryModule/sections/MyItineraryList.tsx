'use client'
import React, { useEffect, useState } from 'react'
import ItineraryCard from '../module-elements/ItineraryCard'
import type {
  ItineraryData,
  ItineraryResponse,
  metadataType,
} from '../module-elements/types'
import { customFetch } from '@/utils/customFetch'
import { Pagination } from '../module-elements/Pagination'

function MyItineraryList({ page }: { page: string }) {
  const defaultMetadata = {
    page: 1,
    totalPages: 1,
    total: 0,
  }
  const [data, setData] = useState<ItineraryData[]>([])
  const [metadata, setMetadata] = useState<metadataType>(defaultMetadata)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyItinerary = async () => {
      try {
        setLoading(true)
        const res = await customFetch<ItineraryResponse>(
          `/itinerary/me?page=${page}`
        )
        if (res.statusCode !== 200) throw new Error(res.message)
        setData(res.itinerary.data)
        setMetadata(res.itinerary.metadata)
        console.log(res)
      } catch (err: any) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMyItinerary().catch((err) => console.log(err))
  }, [page])

  return (
    <div className="flex flex-col gap-8 w-full">
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {data.map((item, index) => (
            <ItineraryCard item={item} key={index} />
          ))}
        </div>
      ) : (
        <div className="w-full flex items-center justify-center py-8">
          Belum ada rencana perjalanan.
        </div>
      )}
      <Pagination {...metadata} />
    </div>
  )
}

export default MyItineraryList
