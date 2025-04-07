import React from 'react'
import { Car, Footprints, Bike, Bus } from 'lucide-react'
import { Motorcycle } from '@/icons/Motorcycle'
import { TransportMode } from '@/utils/maps'

interface RouteInfoProps {
  distance: number // in meters
  duration: number // in seconds
  polyline?: string
  transportMode?: string
}

export const RouteInfo: React.FC<RouteInfoProps> = ({
  distance,
  duration,
  transportMode = TransportMode.DRIVE,
}) => {
  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`
    }
    return `${meters} m`
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours} jam ${minutes} menit`
    }
    return `${minutes} menit`
  }

  const TransportIcon = () => {
    const mode = transportMode as TransportMode

    switch (mode) {
      case TransportMode.WALK:
        return (
          <div className="flex items-center">
            <Footprints size={20} />
          </div>
        )
      case TransportMode.BICYCLE:
        return (
          <div className="flex items-center">
            <Bike size={20} />
          </div>
        )
      case TransportMode.TRANSIT:
        return (
          <div className="flex items-center">
            <Bus size={20} />
          </div>
        )
      case TransportMode.TWO_WHEELER:
        return (
          <div className="flex items-center">
            <Motorcycle size={20} />
          </div>
        )
      case TransportMode.DRIVE:
      default:
        return (
          <div className="flex items-center">
            <Car size={20} />
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col font-raleway text-[#004080] text-sm">
      <div className="flex items-center gap-2">
        <TransportIcon />
        <div className="flex font-semibold">
          <span>{formatDuration(duration)}</span>
          <span className="mx-1">•</span>
          <span>{formatDistance(distance)}</span>
        </div>
      </div>
    </div>
  )
}
