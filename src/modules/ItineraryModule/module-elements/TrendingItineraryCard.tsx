'use client'

import { getImage } from '@/utils/getImage'
import Image from 'next/image'
import type React from 'react'
import type { ItineraryData } from './types'
import { useRouter } from 'next/navigation'

function TrendingItineraryCard({
  item,
}: {
  readonly item: Readonly<ItineraryData>
}) {
  const router = useRouter()
  const daysTotal = Math.floor(
    (new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  return (
    <div
      onClick={() => router.push(`/itinerary/${item.id}`)}
      className="group flex items-center gap-5 shadow-lg w-full rounded-xl overflow-hidden hover:cursor-pointer relative"
    >
      <div className="w-1/4 h-full overflow-hidden">
        <Image
          src={
            item.coverImage !== '' && item.coverImage != null
              ? item.coverImage
              : getImage('logo-no-background.png')
          }
          alt={item.title}
          width={720}
          height={720}
          className="w-full h-full object-cover pointer-events-none group-hover:scale-125 duration-300"
        />
      </div>
      <div className="w-3/4 h-full flex flex-col gap-2 py-4">
        <p className="font-raleway font-medium text-sm md:text-xl w-4/5">
          {item.title}
        </p>
        <div className="font-raleway text-[#94A3B8] flex flex-col gap-1">
          <p className="text-xs md:text-sm">
            {daysTotal} Hari • {item.locationCount} Destinasi
          </p>
        </div>
      </div>
    </div>
  )
}

export default TrendingItineraryCard
