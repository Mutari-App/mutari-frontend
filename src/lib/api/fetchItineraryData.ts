import { customFetch } from '@/utils/newCustomFetch'

interface ItineraryDetailResponse {
  statusCode: number
  success: boolean
  message: string
  data: Itinerary
}

export async function fetchItineraryData(
  id: string
): Promise<ItineraryDetailResponse['data']> {
  try {
    const res = await customFetch<ItineraryDetailResponse>(
      `/itineraries/${id}`,
      {
        credentials: 'include',
      }
    )

    if (res.statusCode === 404) {
      throw new Error('Not found')
    }
    return res.data
  } catch (err: any) {
    throw err
  }
}
