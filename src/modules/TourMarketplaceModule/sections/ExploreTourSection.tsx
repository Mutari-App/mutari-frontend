'use client'

import React, { useState, useEffect } from 'react'
import TourCard from '@/modules/TourSearchResultsModule/module-elements/TourCard'
import { customFetch } from '@/utils/newCustomFetch'
import type {
  TourSearchResult,
  SearchToursResponse,
} from '@/modules/TourSearchResultsModule/interface'
import { Button } from '@/components/ui/button'
import { v4 } from 'uuid'
import Link from 'next/link'

const ExploreTourSection = ({
  title = 'Temukan Tur Seru, Eksplorasi Tanpa Repot',
}: {
  title?: string
}) => {
  const [tours, setTours] = useState<TourSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const limit = 8

  useEffect(() => {
    void fetchTours(1)
  }, [])

  const fetchTours = async (currentPage: number) => {
    try {
      setIsLoading(true)
      const response = await customFetch<SearchToursResponse>(
        `/tour/search?page=${currentPage}&limit=${limit}`,
        { method: 'GET' }
      )

      const newTours = response.data || []

      setTours((prev) => {
        const existingIds = new Set(prev.map((t) => t.id))
        const filtered = newTours.filter((t) => !existingIds.has(t.id))
        return [...prev, ...filtered]
      })
    } catch (error) {
      console.error('Failed to fetch tours:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 mb-4 sm:mb-8 container mx-auto px-4">
      <p className="sm:text-xl md:text-2xl font-semibold">{title}</p>

      {isLoading && tours.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div
              key={`${index}-${v4()}`}
              className="h-64 sm:h-72 rounded-md bg-slate-100 animate-pulse"
              role="status"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="p-2 sm:p-4 border border-[#0073E6] rounded-xl shadow-gray-300 shadow-lg grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
            {tours.map((tour) => (
              <TourCard tour={tour} key={tour.id} />
            ))}
          </div>
          {tours && tours.length > 0 && (
            <Link
              href={'/tour/search'}
              className="w-full md:w-3/4 lg:w-1/2 mx-auto mt-4 md:mt-6 flex justify-center"
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
        </>
      )}
    </div>
  )
}

export default ExploreTourSection
