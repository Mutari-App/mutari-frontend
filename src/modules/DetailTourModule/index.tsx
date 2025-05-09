'use client'
import { TourHeader } from './module-elements/TourHeader'
import { TourDescription } from './module-elements/TourDescription'
import { TourInclude } from './module-elements/TourInclude'
import { TourOrderCard } from './module-elements/TourOrderCard'
import { useEffect, useState } from 'react'
import { customFetch } from '@/utils/newCustomFetch'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { TourSchedule } from './module-elements/TourSchedule'
import { TourList } from './module-elements/TourList'

export default function DetailTourModule() {
  const [data, setData] = useState<Tour | null>(null)
  const [isNotFound, setIsNotFound] = useState(false)
  const { id } = useParams<{ id: string }>()

  const fetchData = async () => {
    try {
      const res = await customFetch<TourDetailResponse>(`/tour/${id}`, {
        credentials: 'include',
      })

      if (res.statusCode === 404 || res.statusCode === 403) {
        setIsNotFound(true)
      }

      setData(res.data)
    } catch (err: any) {
      setIsNotFound(true)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [id])

  return data ? (
    <div className="max-w-6xl mx-auto p-4 pt-24 py-8">
      <TourHeader
        title={data.title}
        location={data.location}
        coverImage={data.coverImage}
      />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <TourDescription
            title={data.title}
            description={data.description}
            maxCapacity={data.maxCapacity}
          />
          {/* <TourInclude includes={[]} /> */}
          {/* <TourSchedule/> */}
        </div>
        <div className="lg:col-span-1">
          <TourOrderCard pricePerTicket={data.pricePerTicket} />
        </div>
        <TourList section={data.itinerary.sections} />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin w-6 h-6 mr-2" />
    </div>
  )
}
