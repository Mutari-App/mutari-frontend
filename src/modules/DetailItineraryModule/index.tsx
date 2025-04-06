'use client'
import { customFetch } from '@/utils/customFetch'
import { ItineraryHeader } from './module-elements/ItineraryHeader'
import { ItineraryList } from './module-elements/ItineraryList'
import { ItinerarySummary } from './module-elements/ItinerarySummary'
import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Maps from '../ItineraryMakerModule/sections/Maps'

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
            isAuthorized: true,
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
    <div className="flex max-h-screen">
      <div className="container max-w-4xl mx-auto p-4 pt-24 min-h-screen max-h-screen overflow-auto">
        <ItineraryHeader data={data} />
        <ItinerarySummary startDate={data.startDate} endDate={data.endDate} />
        <ItineraryList section={data.sections || []} />
      </div>
      <div className="w-full min-h-screen hidden md:block">
        <Maps itineraryData={data.sections ?? []} />
      </div>
    </div>
  )
}
