import React from 'react'
import { Heart } from 'lucide-react'

interface LikesButtonProps {
  count: number
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

const LikesButton: React.FC<LikesButtonProps> = ({ count, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Heart className="h-4 w-4" />
      <span>{formatLikes(count)}</span>
    </div>
  )
}

export default LikesButton
