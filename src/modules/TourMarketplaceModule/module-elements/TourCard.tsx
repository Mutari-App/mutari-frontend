import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { type TourCardProps } from '../interface'
import { DurationTypeMap } from '../constant'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import { getImage } from '@/utils/getImage'

function TourCard({ tour, className }: Readonly<TourCardProps>) {
  return (
    <Card
      className={`flex flex-col overflow-hidden transition-all hover:shadow-md font-raleway group ${className}`}
    >
      <div className="flex flex-col h-full">
        <Link href={`/tour/${tour.id}`} className="flex flex-col h-full">
          <div className="relative h-24 sm:h-40 w-full">
            <Image
              src={
                tour.coverImage !== '' && tour.coverImage
                  ? tour.coverImage
                  : getImage('itinerary_placeholder.png')
              }
              alt={tour.title}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="px-2 py-1.5 sm:px-3 sm:py-2 space-y-1 flex-grow">
            <div className="flex flex-col gap-2">
              <p className="line-clamp-1 max-sm:text-[13px]">{tour.title}</p>
              <div className="flex items-center gap-5 text-[10px] sm:text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <MapPinIcon size={16} />
                  <p>{tour.location}</p>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon size={16} />
                  <p className="text-[10px] sm:text-xs text-slate-500">
                    {tour.duration} {DurationTypeMap[tour.durationType]}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>

        <CardFooter className="px-2 py-1.5 mt-auto sm:px-3 sm:py-2 font-raleway text-[#024C98] font-semibold text-sm sm:text-base">
          {(() => {
            const originalPrice = tour.pricePerTicket * (100 / (100 - 20))

            return (
              <div className="flex flex-col w-full ">
                <div className="flex flex-col  relative w-fit">
                  <div className="flex items-center gap-1.5 ">
                    <span className="text-gray-500 line-through text-xs">
                      Rp{Number(originalPrice).toLocaleString('ID-id')}
                    </span>
                    <span className="bg-red-100 text-red-600 text-xs px-1.5 py-[1px] rounded-md font-medium whitespace-nowrap">
                      20% OFF
                    </span>
                  </div>
                  <span className="text-[#024C98] font-semibold">
                    Rp{Number(tour.pricePerTicket).toLocaleString('ID-id')}
                    /pax
                  </span>
                </div>
              </div>
            )
          })()}
        </CardFooter>
      </div>
    </Card>
  )
}

export default TourCard
