'use client'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { useEffect, useMemo, useState } from 'react'
import {
  GoogleMap,
  type Libraries,
  Marker,
  useLoadScript,
  Polyline,
} from '@react-google-maps/api'
import type {
  GetPlaceDetailsResponse,
  PlaceResult,
  Section,
} from '../interface'
import { customFetch } from '@/utils/newCustomFetch'
import { Globe, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { decodePolyline } from '../utils'

type MapsProps = {
  readonly itineraryData: Readonly<Section[]>
  isEditing?: boolean
  positionToView?: google.maps.LatLngLiteral | null
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

// bonkers IMO that this isn't a method on MVCArray, but here we are
function pathsDiffer(
  path1: google.maps.MVCArray<google.maps.LatLng>,
  path2: google.maps.LatLngLiteral[]
): boolean {
  if (path1.getLength() !== path2.length) return true
  for (const [i, val] of path2.entries())
    if (path1.getAt(i).toJSON() !== val) return true
  return false
}

function PolyLine(props: {
  map: google.maps.Map | null
  path: google.maps.LatLngLiteral[]
  options: google.maps.PolylineOptions
}) {
  const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null)
  useDeepCompareEffect(() => {
    // Create polyline after map initialized.
    if (!polyline && props.map)
      setPolyline(new google.maps.Polyline(props.options))

    // Synchronize map polyline with component props.
    if (polyline && polyline.getMap() != props.map) polyline.setMap(props.map)
    if (polyline && pathsDiffer(polyline.getPath(), props.path))
      polyline.setPath(props.path)

    return () => {
      // Cleanup: remove line from map
      if (polyline) polyline.setMap(null)
    }
  }, [props, polyline])

  return null
}

function Maps({
  itineraryData,
  addLocationToSection,
  isEditing,
  positionToView,
  _testSelectedPlace,
  _testSelectedPlaceDetails,
}: MapsProps) {
  const firstLoc = itineraryData[0]?.blocks?.[0]?.location?.split(',')
  const INDONESIA_BOUNDS = {
    north: 8.0,
    south: -11.0,
    east: 141.1,
    west: 95.0,
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  const defaultCenter = useMemo(
    () =>
      firstLoc
        ? { lat: parseFloat(firstLoc[0]), lng: parseFloat(firstLoc[1]) }
        : { lat: -6.3604, lng: 106.82719 },
    []
  )
  const defaultSelectedPlace = { placeId: '', latLng: { lat: 0, lng: 0 } }

  const [selectedPlace, setSelectedPlace] = useState(
    _testSelectedPlace ?? defaultSelectedPlace
  )
  const [selectedPlaceDetails, setSelectedPlaceDetails] =
    useState<PlaceResult | null>(_testSelectedPlaceDetails ?? null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const { locations, routes } = useMemo(() => {
    const locations: { lat: number; lng: number }[] = []
    const routes: {
      path: { lat: number; lng: number }[]
      options?: google.maps.PolylineOptions
    }[] = []

    itineraryData?.forEach((section) => {
      if (section.blocks?.length) {
        section.blocks.forEach((block, index) => {
          if (block.location) {
            const [lat, lng] = block.location
              .split(',')
              .map((coord) => parseFloat(coord.trim()))
            locations.push({ lat, lng })
          }

          if (block.routeToNext?.polyline) {
            const decodedPath = decodePolyline(block.routeToNext.polyline)
            routes.push({
              path: decodedPath,
              options: {
                strokeColor: '#4285F4',
                strokeWeight: 4,
                strokeOpacity: 0.8,
              },
            })
          }
        })
      }
    })

    return { locations, routes }
  }, [itineraryData])

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
      const sectionNumber = itineraryData.length
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

  useEffect(() => {
    if (positionToView && map) {
      map.panTo(positionToView)
    }
  }, [positionToView, map])

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
            restriction: {
              latLngBounds: INDONESIA_BOUNDS,
              strictBounds: false,
            },
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

          {routes.map((route, idx) => (
            <PolyLine
              key={`polyline-${idx}`}
              map={map}
              path={route.path}
              options={route.options!}
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
                  Tambahkan ke itinerary
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
