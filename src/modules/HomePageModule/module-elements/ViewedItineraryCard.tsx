'use client'

import { getImage } from '@/utils/getImage'
import { Heart, MoreHorizontal, X } from 'lucide-react'
import Image from 'next/image'
import type React from 'react'
import { MouseEvent, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import { type ItineraryData } from '@/modules/ItineraryModule/module-elements/types'

function ViewedItineraryCard({
  item,
}: {
  readonly item: Readonly<ItineraryData>
}) {
  const { user } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [isPopping, setIsPopping] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const router = useRouter()

  const onLike = (
    e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    setIsPopping(true)

    setTimeout(() => {
      setIsPopping(false)
    }, 300)
  }

  return (
    <div
      onClick={() => router.push(`/itinerary/${item.id}`)}
      className="group flex flex-col shadow-lg w-1/5 min-w-[250px] rounded-xl max-h-fit overflow-hidden hover:cursor-pointer relative"
    >
      <div className="w-full h-full max-h-32 md:max-h-48 overflow-hidden">
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
      <div className="w-full h-full flex flex-col justify-between gap-2 px-4 py-3">
        <div className="flex flex-col gap-2 font-raleway">
          <p className="font-raleway font-medium text-sm md:text-xl w-4/5">
            {item.title}
          </p>
          <p className="text-xs md:text-sm text-[#94A3B8] line-clamp-2">
            {item.description ?? ''}
          </p>
        </div>
        <div className="w-full flex justify-between gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <Image
              src={'/images/profile-placeholder.png'}
              alt={item.userId}
              width={720}
              height={720}
              className="w-full h-full object-cover pointer-events-none duration-300"
            />
            <p>{item.user?.firstName}</p>
          </div>
          <div className="flex items-center gap-2">
            <div
              data-testid="heart-icon"
              onClick={onLike}
              className={`hover:cursor-pointer hover:text-red-500 ${isLiked && 'text-red-500'} ${isPopping && 'pop-animation'}`}
            >
              <Heart
                className={`${isPopping && 'pop-animation'}`}
                fill={isLiked ? 'red' : 'white'}
              />
            </div>
            <p>{item.likes}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewedItineraryCard
