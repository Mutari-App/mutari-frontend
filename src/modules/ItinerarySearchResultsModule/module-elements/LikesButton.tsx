import React, { useState } from 'react'
import { Heart } from 'lucide-react'
import { customFetch } from '@/utils/newCustomFetch'
import { toast } from 'sonner'

interface LikesButtonProps {
  count: number
  liked: boolean
  itineraryId: string
  className?: string
}

// Format number to use 'k' for thousands
const formatLikes = (likes: number): string => {
  if (likes >= 1000) {
    const formatted = (likes / 1000).toFixed(1)
    // Remove decimal if it's .0
    return `${formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted}k`
  }
  return likes.toString()
}

const LikesButton: React.FC<LikesButtonProps> = ({
  count,
  liked,
  itineraryId,
  className = '',
}) => {
  const [isLiked, setIsLiked] = useState(liked)
  const [likeCount, setLikeCount] = useState(count)

  const toggleLike = async () => {
    try {
      if (isLiked) {
        // unsave
        setIsLiked(false)
        setLikeCount(likeCount - 1)
      } else {
        setIsLiked(true)
        setLikeCount(likeCount + 1)
      }

      await customFetch(`/itineraries/${itineraryId}/save`, {
        method: isLiked === true ? 'DELETE' : 'POST',
        credentials: 'include',
      })

      toast.success(isLiked === true ? 'Itinerary unsaved' : 'Itinerary saved!')
    } catch (error) {
      console.error('Failed to save/unsave itinerary:', error)
    }
  }

  return (
    <div
      className={`flex items-center gap-1 ${className} ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
    >
      <Heart
        onClick={toggleLike}
        className={`h-4 w-4 cursor-pointer ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500'}`}
      />
      <span>{formatLikes(likeCount)}</span>
    </div>
  )
}

export default LikesButton
