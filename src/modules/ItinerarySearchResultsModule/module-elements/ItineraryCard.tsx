import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { type ItinerarySearchResult } from '../interface'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import LikesButton from './LikesButton'
import { useAuthContext } from '@/contexts/AuthContext'

interface ItineraryCardProps {
  itinerary: ItinerarySearchResult
  isLiked: boolean
  maxVisibleTags?: number
  className?: string
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({
  itinerary,
  isLiked,
  maxVisibleTags = 3,
  className = '',
}) => {
  const { id, firstName, lastName, photoProfile } = itinerary.user
  const fullName = `${firstName} ${lastName ?? ''}`
  const initials = `${firstName.charAt(0)}${lastName?.charAt(0) || ''}`

  const visibleTags = itinerary.tags.slice(0, maxVisibleTags)
  const hiddenTagsCount = Math.max(0, itinerary.tags.length - maxVisibleTags)
  const { isAuthenticated, user } = useAuthContext()

  return (
    <Card
      className={`flex flex-col overflow-hidden transition-all hover:shadow-md font-raleway group ${className}`}
    >
      <div className="flex flex-col h-full">
        <Link
          href={`/itinerary/${itinerary.id}`}
          className="flex flex-col h-full"
        >
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
                <span className="text-slate-400 max-sm:text-sm">
                  Tidak Ada Gambar
                </span>
              </div>
            )}
            {/* Mobile-only (< 640px) Likes button at top right with semi-transparent background */}
            <div
              className="absolute top-2 right-2 bg-black bg-opacity-25 rounded-full px-1.5 py-[3px] sm:hidden"
              data-testid="mobile-likes-wrapper"
            >
              <LikesButton
                itineraryId={itinerary.id}
                liked={isLiked}
                count={itinerary.likes}
                enabled={isAuthenticated && itinerary.user.id !== user?.id}
                className="text-xs text-white"
              />
            </div>
          </div>
          <CardContent className="px-2 py-1.5 sm:px-3 sm:py-2 space-y-1 flex-grow">
            <div>
              <p className="line-clamp-1 max-sm:text-[13px]">
                {itinerary.title}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500">
                {itinerary.daysCount} hari • Dibuat pada{' '}
                {format(itinerary.createdAt, 'dd MMM yyyy', {
                  locale: localeId,
                })}
              </p>
            </div>
            <p className="line-clamp-2 text-[11px] sm:text-[13px] text-slate-500">
              {itinerary.description}
            </p>
            {itinerary.tags && itinerary.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {visibleTags.map((itineraryTag) => (
                  <Badge
                    key={itineraryTag.tag.id}
                    variant="secondary"
                    className="flex items-center gap-1 bg-blue-100 text-[#024C98] rounded-full text-[8px] sm:text-[10px] px-1.5 py-0.5"
                  >
                    {itineraryTag.tag.name}
                  </Badge>
                ))}
                {hiddenTagsCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="flex items-center bg-blue-100 text-[#024C98] rounded-full text-[8px] sm:text-[10px] px-1.5 py-0.5"
                  >
                    <span>+</span>
                    <span className="relative -top-[1px] ml-[1px]">
                      {hiddenTagsCount}
                    </span>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Link>

        <CardFooter className="flex items-center justify-between px-2 py-1.5 mt-auto sm:px-3 sm:py-2 border-t border-slate-100">
          <Link
            href={`/profile/${id}`}
            className="flex items-center gap-1 sm:gap-2 relative"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={photoProfile ?? undefined} alt={fullName} />
              <AvatarFallback className="text-[10px] sm:text-xs bg-blue-50">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] sm:text-[13px] whitespace-nowrap truncate overflow-hidden max-w-[90px] min-[340px]:max-w-[120px]">
              {fullName}
            </span>
          </Link>
          {/* Desktop-only (≥ 640px) Likes button */}
          <div className="hidden sm:block" data-testid="desktop-likes-wrapper">
            <LikesButton
              itineraryId={itinerary.id}
              liked={isLiked}
              count={itinerary.likes}
              enabled={isAuthenticated && itinerary.user.id !== user?.id}
              className="text-[10px] pl-1 sm:text-sm"
            />
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}

export default ItineraryCard
