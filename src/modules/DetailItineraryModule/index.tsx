'use client'
import { customFetch } from '@/utils/customFetch'
import { ItineraryHeader } from './module-elements/ItineraryHeader'
import { ItineraryList } from './module-elements/ItineraryList'
import { ItinerarySummary } from './module-elements/ItinerarySummary'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function DetailItineraryModule() {
  const [data, setData] = useState<Itinerary>({} as Itinerary)
  const [error, setError] = useState<string | null>(null)
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

        if (res.statusCode !== 200) throw new Error(res.message)

        setData(res.data)
        setError(null)
        document.title = `${res.data.title} - Mutari`
      } catch (err: any) {
        setError('Gagal menampilkan detail itinerary')
      }
    }
    void fetchData()
  }, [id])

  return (
    <div className="flex justify-center m-4 p-6">
      {error && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md">
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-2 text-sm opacity-80 hover:opacity-100"
          >
            ✖
          </button>
        </div>
      )}
      <div>
        <ItineraryHeader data={data} />
        <ItinerarySummary startDate={data.startDate} endDate={data.endDate} />
        <ItineraryList section={data.sections || []} />
      </div>
    </div>
  )
}
