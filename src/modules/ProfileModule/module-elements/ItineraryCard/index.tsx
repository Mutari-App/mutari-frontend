import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { type ItineraryProps } from '../../interface'
import LikesButton from '@/modules/ItinerarySearchResultsModule/module-elements/LikesButton'

interface ItineraryCardProps {
  itinerary: ItineraryProps
}

export const LikedItineraryCard: React.FC<ItineraryCardProps> = ({
  itinerary,
}) => {
  return (
    <Link href={`/itinerary/${itinerary.id}`}>
      <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md font-raleway">
        <div className="relative h-24 sm:h-40 w-full">
          {itinerary.coverImage ? (
            <Image
              src={itinerary.coverImage}
              alt={itinerary.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-50">
              <span className="text-slate-400">Tidak Ada Gambar</span>
            </div>
          )}
        </div>
        <CardContent className="px-2 py-1.5 sm:px-3 sm:py-2 space-y-1 flex-grow">
          <div>
            <div>
              <p className="line-clamp-1 max-sm:text-xs">{itinerary.title}</p>
            </div>
            <p className="line-clamp-2 text-[11px] sm:text-[13px] text-slate-500">
              {itinerary.description}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-2 py-1.5 mt-auto sm:px-3 sm:py-2 border-t border-slate-100">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-sm text-slate-500">
              {(() => {
                const formatDate = (dateStr: string) => {
                  const date = new Date(dateStr)
                  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`
                }

                return `${formatDate(itinerary.startDate)} - ${formatDate(itinerary.endDate)} • ${itinerary.totalDestinations} Destinasi`
              })()}
            </span>
          </div>

          <LikesButton
            itineraryId={itinerary.id}
            liked={true}
            count={itinerary.totalLikes}
            enabled={true}
            className="text-[10px] pl-1 sm:text-sm"
          />
        </CardFooter>
      </Card>
    </Link>
  )
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary }) => {
  return (
    <Link href={`/itinerary/${itinerary.id}`}>
      <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md font-raleway">
        <div className="relative h-24 sm:h-40 w-full">
          {itinerary.coverImage ? (
            <Image
              src={itinerary.coverImage}
              alt={itinerary.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-50">
              <span className="text-slate-400">Tidak Ada Gambar</span>
            </div>
          )}
        </div>
        <CardContent className="px-2 py-1.5 sm:px-3 sm:py-2 space-y-1 flex-grow">
          <div>
            <div>
              <p className="line-clamp-1 max-sm:text-xs">{itinerary.title}</p>
            </div>
            <p className="line-clamp-2 text-[11px] sm:text-[13px] text-slate-500">
              {itinerary.description}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-2 py-1.5 mt-auto sm:px-3 sm:py-2 border-t border-slate-100">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-sm text-slate-500">
              {(() => {
                const formatDate = (dateStr: string) => {
                  const date = new Date(dateStr)
                  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`
                }

                return `${formatDate(itinerary.startDate)} - ${formatDate(itinerary.endDate)} • ${itinerary.totalDestinations} Destinasi`
              })()}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

export default ItineraryCard
