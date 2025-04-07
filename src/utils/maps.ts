import { toast } from 'sonner'

export enum TransportMode {
  DRIVE = 'DRIVE',
  WALK = 'WALK',
  BICYCLE = 'BICYCLE',
  TRANSIT = 'TRANSIT',
  TWO_WHEELER = 'TWO_WHEELER',
}

export const transportModeNames = {
  [TransportMode.DRIVE]: 'Mobil',
  [TransportMode.WALK]: 'Jalan Kaki',
  [TransportMode.BICYCLE]: 'Sepeda',
  [TransportMode.TRANSIT]: 'Transportasi Umum',
  [TransportMode.TWO_WHEELER]: 'Motor',
}

interface RouteResponse {
  distance: number
  duration: number
  polyline: string
}

interface Route {
  distanceMeters: number
  duration: string // ISO 8601 duration format (e.g., "1200s" for 20 minutes)
  polyline: {
    encodedPolyline: string
  }
}

interface ComputeRoutesResponse {
  routes: Route[]
}

interface LatLng {
  latitude: number
  longitude: number
}

interface Location {
  latLng: LatLng
}

interface Waypoint {
  location: Location
}

interface ComputeRoutesRequest {
  origin: Waypoint
  destination: Waypoint
  travelMode: TransportMode
  computeAlternativeRoutes: boolean
  polylineQuality: 'HIGH_QUALITY'
  polylineEncoding: 'ENCODED_POLYLINE'
  routingPreference?: 'TRAFFIC_AWARE'
}

export async function calculateRoute(
  origin: string,
  destination: string,
  transportMode: TransportMode = TransportMode.DRIVE
): Promise<RouteResponse | null> {
  try {
    const originCoords = origin.split(',').map(Number)
    const destinationCoords = destination.split(',').map(Number)
    if (originCoords.length !== 2 || destinationCoords.length !== 2) {
      toast.error('Koordinat asal atau tujuan tidak valid')
      return null
    }

    const requestBody: ComputeRoutesRequest = {
      origin: {
        location: {
          latLng: {
            latitude: originCoords[0],
            longitude: originCoords[1],
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: destinationCoords[0],
            longitude: destinationCoords[1],
          },
        },
      },
      travelMode: transportMode,
      computeAlternativeRoutes: false,
      polylineQuality: 'HIGH_QUALITY',
      polylineEncoding: 'ENCODED_POLYLINE',
    }

    // Add routingPreference for DRIVE and TWO_WHEELER modes
    if (
      transportMode === TransportMode.DRIVE ||
      transportMode === TransportMode.TWO_WHEELER
    ) {
      requestBody.routingPreference = 'TRAFFIC_AWARE'
    }

    const response = await fetch(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
          'X-Goog-FieldMask':
            'routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline',
        },
        body: JSON.stringify(requestBody),
      }
    )

    if (!response.ok) {
      toast.error(`Gagal menghitung rute: error ${response.status}`, {
        id: 'route-calc',
      })
      return null
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: ComputeRoutesResponse = await response.json()

    if (!data.routes?.length) {
      toast.error(
        `Rute tidak ditemukan untuk mode ${transportModeNames[transportMode]}`,
        {
          id: 'route-calc',
        }
      )
      return null
    }

    const route = data.routes[0]
    return {
      distance: route.distanceMeters ?? 0,
      duration: parseInt(route.duration.replace('s', '')),
      polyline: route.polyline.encodedPolyline,
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error('Gagal menghitung rute', { id: 'route-calc' })
    return null
  }
}
