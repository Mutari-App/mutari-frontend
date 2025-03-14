'use client'
import { customFetch } from '@/utils/customFetch'
import { ItineraryHeader } from './module-elements/ItineraryHeader'
import { ItineraryList } from './module-elements/ItineraryList'
import { ItinerarySummary } from './module-elements/ItinerarySummary'
import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'

/**
 * Retrieves and displays itinerary details based on the itinerary ID from the URL.
 *
 * This component fetches itinerary details using a custom fetch call and updates the state accordingly.
 * If the fetch returns a 404 response or encounters an error, it triggers the not found page; otherwise,
 * it renders the itinerary information and updates the document title to include the itinerary's title followed by " - Mutari".
 *
 * @returns A React component containing the itinerary header, summary, and list, or it triggers a not found state.
 */
export default function DetailItineraryModule() {
  const [data, setData] = useState<Itinerary>({} as Itinerary)
  const [isNotFound, setIsNotFound] = useState(false)
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await customFetch<ItineraryDetailResponse>(
          `/itineraries/${id}`,
          {
            credentials: 'include',
          }
        )

        if (res.statusCode === 404) {
          setIsNotFound(true)
        }

        setData(res.data)
        document.title = `${res.data.title} - Mutari`
      } catch (err: any) {
        setIsNotFound(true)
      }
    }
    void fetchData()
  }, [id])

  if (isNotFound) {
    notFound() 
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 min-h-screen">
      <ItineraryHeader data={data} />
      <ItinerarySummary startDate={data.startDate} endDate={data.endDate} />
      <ItineraryList section={data.sections || []} />
    </div>
  )
}
