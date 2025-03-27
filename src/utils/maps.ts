import { toast } from 'sonner'

interface RouteResponse {
  distance: number
  duration: number
  polyline: string
}

interface Waypoint {
  location: {
    latLng: {
      latitude: number
      longitude: number
    }
  }
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

export async function calculateRoute(
  origin: string,
  destination: string
): Promise<RouteResponse | null> {
  try {
    const originCoords = origin.split(',').map(Number)
    const destinationCoords = destination.split(',').map(Number)

    if (originCoords.length !== 2 || destinationCoords.length !== 2) {
      toast.error('Invalid origin or destination coordinates')
      return null
    }

    const originWaypoint: Waypoint = {
      location: {
        latLng: {
          latitude: originCoords[0],
          longitude: originCoords[1],
        },
      },
    }

    const destinationWaypoint: Waypoint = {
      location: {
        latLng: {
          latitude: destinationCoords[0],
          longitude: destinationCoords[1],
        },
      },
    }

    const requestBody = {
      origin: originWaypoint,
      destination: destinationWaypoint,
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE',
      computeAlternativeRoutes: false,
      polylineQuality: 'HIGH_QUALITY',
      polylineEncoding: 'ENCODED_POLYLINE',
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
      console.error(`HTTP error! status: ${response.status}`)
      return null
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: ComputeRoutesResponse = await response.json()

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0]
      return {
        distance: route.distanceMeters,
        duration: parseInt(route.duration.replace('s', '')),
        polyline: route.polyline.encodedPolyline,
      }
    } else {
      return null
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null
  }
}
