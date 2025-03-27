import React from 'react'
import { Car } from 'lucide-react'

interface RouteInfoProps {
  distance: number // in meters
  duration: number // in seconds
  polyline?: string
}

export const RouteInfo: React.FC<RouteInfoProps> = ({ distance, duration }) => {
  // Format distance (convert to km if ≥ 1000m)
  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`
    }
    return `${meters} m`
  }

  // Format duration (convert to hours and minutes)
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours} jam ${minutes} menit`
    }
    return `${minutes} menit`
  }

  return (
    <div className="flex flex-col font-raleway text-[#004080] text-sm">
      <div className="w-0.5 h-3 md:h-4 bg-[#004080] ml-2"></div>
      <div className="flex items-center gap-2 ml-1">
        <Car size={20} />
        <div className="flex font-semibold">
          <span>{formatDuration(duration)}</span>
          <span className="mx-1">•</span>
          <span>{formatDistance(distance)}</span>
        </div>
      </div>
      <div className="w-0.5 h-3 md:h-4 bg-[#004080] ml-2"></div>
    </div>
  )
}
