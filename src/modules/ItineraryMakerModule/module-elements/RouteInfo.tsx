import React from 'react'
import { Car, Footprints, Bike, Bus } from 'lucide-react'
import { Motorcycle } from '@/icons/Motorcycle'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

enum TransportMode {
  DRIVE = 'DRIVE',
  WALK = 'WALK',
  BICYCLE = 'BICYCLE',
  TRANSIT = 'TRANSIT',
  TWO_WHEELER = 'TWO_WHEELER',
}

const transportModeNames = {
  [TransportMode.DRIVE]: 'Mobil',
  [TransportMode.WALK]: 'Jalan Kaki',
  [TransportMode.BICYCLE]: 'Sepeda',
  [TransportMode.TRANSIT]: 'Transportasi Umum',
  [TransportMode.TWO_WHEELER]: 'Motor',
}

interface RouteInfoProps {
  distance: number // in meters
  duration: number // in seconds
  polyline?: string
  transportMode?: TransportMode
  onTransportModeChange?: (mode: TransportMode) => Promise<boolean>
}

export const RouteInfo: React.FC<RouteInfoProps> = ({
  distance,
  duration,
  transportMode = TransportMode.DRIVE,
  onTransportModeChange,
}) => {
  const [displayMode, setDisplayMode] = React.useState(transportMode)

  React.useEffect(() => {
    setDisplayMode(transportMode)
  }, [transportMode])

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
    switch (displayMode) {
      case TransportMode.WALK:
        return (
          <div className="flex items-center">
            <Footprints size={20} />
            {onTransportModeChange === undefined && (
              <span className="ml-1 text-xs">
                {transportModeNames[TransportMode.WALK]}
              </span>
            )}
          </div>
        )
      case TransportMode.BICYCLE:
        return (
          <div className="flex items-center">
            <Bike size={20} />
            {onTransportModeChange === undefined && (
              <span className="ml-1 text-xs">
                {transportModeNames[TransportMode.BICYCLE]}
              </span>
            )}
          </div>
        )
      case TransportMode.TRANSIT:
        return (
          <div className="flex items-center">
            <Bus size={20} />
            {onTransportModeChange === undefined && (
              <span className="ml-1 text-xs">
                {transportModeNames[TransportMode.TRANSIT]}
              </span>
            )}
          </div>
        )
      case TransportMode.TWO_WHEELER:
        return (
          <div className="flex items-center">
            <Motorcycle size={20} />
            {onTransportModeChange === undefined && (
              <span className="ml-1 text-xs">
                {transportModeNames[TransportMode.TWO_WHEELER]}
              </span>
            )}
          </div>
        )
      case TransportMode.DRIVE:
      default:
        return (
          <div className="flex items-center">
            <Car size={20} />
            {onTransportModeChange === undefined && (
              <span className="ml-1 text-xs">
                {transportModeNames[TransportMode.DRIVE]}
              </span>
            )}
          </div>
        )
    }
  }

  const handleTransportModeChange = async (newMode: TransportMode) => {
    const previousMode = displayMode
    setDisplayMode(newMode)
    if (onTransportModeChange) {
      try {
        const success = await onTransportModeChange(newMode)
        if (!success) {
          setDisplayMode(previousMode)
        }
      } catch {
        setDisplayMode(previousMode)
      }
    }
  }

  return (
    <div className="flex flex-col font-raleway text-[#004080] text-sm">
      <div className="w-0.5 h-3 md:h-4 bg-[#004080] ml-2"></div>
      <div className="flex items-center gap-2">
        {onTransportModeChange ? (
          <Select
            value={displayMode}
            onValueChange={(value) => {
              void handleTransportModeChange(value as TransportMode)
            }}
          >
            <SelectTrigger className="w-auto p-1 h-auto border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none">
              <SelectValue>
                <TransportIcon />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TransportMode.DRIVE}>
                <div className="flex items-center">
                  <Car className="mr-2" size={16} />
                  <span>{transportModeNames[TransportMode.DRIVE]}</span>
                </div>
              </SelectItem>
              <SelectItem value={TransportMode.TWO_WHEELER}>
                <div className="flex items-center">
                  <Motorcycle className="mr-2" size={16} />
                  <span>{transportModeNames[TransportMode.TWO_WHEELER]}</span>
                </div>
              </SelectItem>
              <SelectItem value={TransportMode.WALK}>
                <div className="flex items-center">
                  <Footprints className="mr-2" size={16} />
                  <span>{transportModeNames[TransportMode.WALK]}</span>
                </div>
              </SelectItem>
              <SelectItem value={TransportMode.BICYCLE}>
                <div className="flex items-center">
                  <Bike className="mr-2" size={16} />
                  <span>{transportModeNames[TransportMode.BICYCLE]}</span>
                </div>
              </SelectItem>
              <SelectItem value={TransportMode.TRANSIT}>
                <div className="flex items-center">
                  <Bus className="mr-2" size={16} />
                  <span>{transportModeNames[TransportMode.TRANSIT]}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <TransportIcon />
        )}
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
