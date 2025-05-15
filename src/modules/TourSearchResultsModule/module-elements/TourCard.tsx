import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { DurationTypeMap } from '@/modules/TourMarketplaceModule/constant'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import { type TourSearchResult } from '../interface'

interface TourCardProps {
  tour: TourSearchResult
  className?: string
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  return (
    <Card
      className={`flex flex-col overflow-hidden transition-all hover:shadow-md font-raleway group`}
    >
      <div className="flex flex-col h-full">
        <Link href={`/tour/${tour.id}`} className="flex flex-col h-full">
          <div className="relative h-24 sm:h-40 w-full">
            {tour.coverImage ? (
              <Image
                src={tour.coverImage}
                alt={tour.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-blue-50 text-sm">
                <span className="text-slate-400">Tidak Ada Gambar</span>
              </div>
            )}
            {tour.availableTickets > 0 ? (
              <div className="absolute top-2 right-2 bg-green-300 text-gray-700 text-[10px] min-[500px]:text-xs px-2 py-0.5 min-[500px]:py-1 rounded-full">
                {tour.availableTickets} tiket tersedia
              </div>
            ) : (
              <div className="absolute top-2 right-2 bg-red-300 text-gray-700 text-[10px] min-[500px]:text-xs px-2 py-0.5 min-[500px]:py-1 rounded-full">
                Tiket habis
              </div>
            )}
          </div>
          <CardContent className="px-2 py-1.5 sm:px-3 sm:py-2 space-y-1 flex-grow">
            <div className="flex flex-col gap-2">
              <p className="line-clamp-1 max-sm:text-[13px]">{tour.title}</p>
              <div className="flex flex-col min-[500px]:flex-row items-start min-[500px]:items-center gap-1 min-[500px]:gap-5 text-[11px] sm:text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <MapPinIcon size={16} />
                  <p>{tour.location}</p>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon size={16} />
                  <p>
                    {tour.duration} {DurationTypeMap[tour.durationType]}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>

        <CardFooter className="px-2 py-1.5 mt-auto sm:px-3 sm:py-2 font-raleway text-[#024C98] font-semibold text-sm sm:text-base">
          Rp{Number(tour.pricePerTicket).toLocaleString('ID-id')}/pax
        </CardFooter>
      </div>
    </Card>
  )
}

export default TourCard
