'use client'
import { customFetch } from '@/utils/customFetch'
import { ItineraryHeader } from './module-elements/ItineraryHeader'
import { ItineraryList } from './module-elements/ItineraryList'
import { ItinerarySummary } from './module-elements/ItinerarySummary'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function DetailItineraryModule() {
  const [data, setData] = useState<Itinerary>({} as Itinerary)
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    void (async () => {
      try {
        const res = await customFetch<ItineraryDetailResponse>(
          `/itineraries/${id}`,
          {
            credentials: 'include',
          }
        )
        console.log('Itinerary Response:', res)
        if (res.statusCode !== 200) throw new Error(res.message)

        setData(res.data)
      } catch (err: any) {
        console.error('Fetch Error:', err)
      }
    })()
  }, [id])

  return (
    <div className="flex justify-center m-4 p-6">
      <div>
        <ItineraryHeader data={data} />
        <ItinerarySummary startDate={data.startDate} endDate={data.endDate} />
        <ItineraryList section={data.sections || []} />
      </div>
    </div>
  )
}
