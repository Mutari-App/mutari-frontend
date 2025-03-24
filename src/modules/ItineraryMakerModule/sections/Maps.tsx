import React from 'react'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import type { CreateItineraryDto } from '../interface'

type MapsProps = {
  readonly itineraryData: Readonly<CreateItineraryDto>
}

function Maps({ itineraryData }: MapsProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  const defaultCenter = React.useMemo(
    () => ({ lat: -6.3604, lng: 106.82719 }),
    []
  )
  const locations = itineraryData.sections.flatMap(
    (section) =>
      section.blocks?.flatMap((block) => {
        if (!block.location) return []
        const [lat, lng] = block.location
          .split(',')
          .map((coord) => parseFloat(coord.trim()))
        return { lat, lng }
      }) ?? []
  )

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ['places'],
  })

  return (
    <div className="w-full h-full">
      {!isLoaded ? (
        <div>Loading...</div>
      ) : (
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={defaultCenter}
          zoom={10}
          options={{
            streetViewControl: false,
          }}
        >
          {locations.map((loc) => (
            <Marker key={`${loc.lat}-${loc.lng}`} position={loc} data-testid="map-marker" />
          ))}
        </GoogleMap>
      )}
    </div>
  )
}

export default Maps
