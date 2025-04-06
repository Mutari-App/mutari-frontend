'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  GoogleMap,
  type Libraries,
  Marker,
  useLoadScript,
} from '@react-google-maps/api'
import type {
  GetPlaceDetailsResponse,
  PlaceResult,
  Section,
} from '../interface'
import { customFetch } from '@/utils/customFetch'
import { Globe, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type MapsProps = {
  readonly itineraryData: Readonly<Section[]>
  isEditing?: boolean
  addLocationToSection?: (
    sectionNumber: number,
    title: string,
    location: string
  ) => void
  _testSelectedPlace?: {
    placeId: string
    latLng: {
      lat: number
      lng: number
    }
  }
  _testSelectedPlaceDetails?: PlaceResult
}

function Maps({
  itineraryData,
  addLocationToSection,
  isEditing,
  _testSelectedPlace,
  _testSelectedPlaceDetails,
}: MapsProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
  const defaultCenter = useMemo(() => ({ lat: -6.3604, lng: 106.82719 }), [])
  const defaultSelectedPlace = { placeId: '', latLng: { lat: 0, lng: 0 } }

  const [selectedPlace, setSelectedPlace] = useState(
    _testSelectedPlace ?? defaultSelectedPlace
  )
  const [selectedPlaceDetails, setSelectedPlaceDetails] =
    useState<PlaceResult | null>(_testSelectedPlaceDetails ?? null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const locations = itineraryData?.flatMap(
    (section) =>
      section.blocks?.flatMap((block) => {
        if (!block.location) return []
        const [lat, lng] = block.location
          .split(',')
          .map((coord) => parseFloat(coord.trim()))
        return { lat, lng }
      }) ?? []
  )

  const [libraries] = useState<Libraries>(['places'])

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  })

  const fetchPlaceDetails = async (placeId: string) => {
    try {
      const res = await customFetch<GetPlaceDetailsResponse>(
        `/map/details?placeId=${placeId}`,
        {
          method: 'GET',
        }
      )
      if (res.success) {
        setSelectedPlaceDetails(res.details.result)
      }
    } catch (error) {
      console.error('Error fetching place details:', error)
    }
  }

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!isEditing) {
      e.stop()
      return
    }
    if ('placeId' in e) {
      console.log(e.placeId)
      setSelectedPlace({
        placeId: e.placeId as string,
        latLng: { lat: e.latLng?.lat() ?? 0, lng: e.latLng?.lng() ?? 0 },
      })
      if (e.latLng && map) {
        map.panTo(e.latLng)
      }
    } else {
      setSelectedPlace(defaultSelectedPlace)
    }
    e.stop()
  }

  const handleAddToItinerary = () => {
    if (selectedPlaceDetails) {
      const { name } = selectedPlaceDetails
      const location = `${selectedPlace.latLng.lat}, ${selectedPlace.latLng.lng}`
      const sectionNumber = 1 // Replace with the actual section number you want to add to
      const title = name || 'New Place'

      if (addLocationToSection) {
        addLocationToSection(sectionNumber, title, location)
      }
    }
    setSelectedPlace(defaultSelectedPlace)
    setSelectedPlaceDetails(null)
  }

  useEffect(() => {
    if (selectedPlace.placeId) {
      void fetchPlaceDetails(selectedPlace.placeId)
    }
  }, [selectedPlace])

  return (
    <div className="w-full h-full">
      {!isLoaded ? (
        <div>Loading...</div>
      ) : (
        <GoogleMap
          mapContainerClassName="w-full h-full relative"
          center={defaultCenter}
          zoom={12}
          onLoad={(map) => setMap(map)}
          options={{
            streetViewControl: false,
          }}
          onClick={handleMapClick}
        >
          {locations.map((loc) => (
            <Marker
              key={`${loc.lat}-${loc.lng}`}
              position={loc}
              data-testid="map-marker"
            />
          ))}

          {selectedPlace.latLng.lat && selectedPlace.latLng.lng && (
            <Marker
              position={selectedPlace.latLng}
              onClick={() => {
                setSelectedPlace(selectedPlace)
              }}
            />
          )}

          {selectedPlace.placeId && selectedPlaceDetails && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-11/12 flex flex-col gap-5 bg-white max-h-[50dvh] overflow-auto rounded-2xl shadow-md p-6">
              <div className="flex justify-between ">
                <div className="flex gap-2 flex-col">
                  <h3 className="font-semibold text-lg">
                    {selectedPlaceDetails.name}
                  </h3>
                  <p className="text-gray-600">
                    {selectedPlaceDetails.vicinity}
                  </p>
                  <div className="flex gap-1 items-center text-sm">
                    ⭐
                    <p className="text-gray-600">
                      <span className="text-yellow-500 font-semibold">
                        {selectedPlaceDetails.rating}{' '}
                      </span>
                      ({selectedPlaceDetails.user_ratings_total})
                    </p>
                  </div>
                </div>

                <Button
                  size={'sm'}
                  variant={'gradient'}
                  onClick={handleAddToItinerary}
                >
                  Add to Itinerary
                </Button>
              </div>

              <div className="flex gap-2 flex-col text-sm text-gray-600">
                {selectedPlaceDetails.international_phone_number && (
                  <div className="flex gap-2 items-center">
                    <Phone size={16} />
                    <p>{selectedPlaceDetails.international_phone_number}</p>
                  </div>
                )}
                {selectedPlaceDetails.website && (
                  <div className="flex gap-2 items-center">
                    <Globe size={16} />
                    <Link
                      href={selectedPlaceDetails.website}
                      target="_blank"
                      className="text-sky-600 hover:text-blue-400 underline"
                    >
                      {selectedPlaceDetails.website}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </GoogleMap>
      )}
    </div>
  )
}

export default Maps
