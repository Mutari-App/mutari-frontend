'use client'
import { customFetch } from '@/utils/newCustomFetch'
import { ItineraryHeader } from './module-elements/ItineraryHeader'
import { ItineraryList } from './module-elements/ItineraryList'
import { ItinerarySummary } from './module-elements/ItinerarySummary'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Maps from '../ItineraryMakerModule/sections/Maps'
import { PlanPicker } from './module-elements/PlanPicker'
import { APIProvider } from '@vis.gl/react-google-maps'
import { Loader2 } from 'lucide-react'
import NotFound from '@/app/not-found'
import { useAuthContext } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export default function DetailItineraryModule() {
  const { isAuthenticated, user } = useAuthContext()
  const router = useRouter()

  const [data, setData] = useState<Itinerary | null>(null)
  const [contingencies, setContingencies] = useState<ContingencyPlan[]>()
  const [selectedContingency, setSelectedContingency] =
    useState<ContingencyPlan>()
  const [isNotFound, setIsNotFound] = useState(false)
  const { id, contingencyId } = useParams<{
    id: string
    contingencyId: string
  }>()

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
      } else if (res.statusCode === 403) {
        router.push('/')
        toast.error('Itinerary ini merupakan itinerary pribadi')
      }

      setData(res.data)
    } catch (err: any) {
      setIsNotFound(true)
    }
  }

  useEffect(() => {
    void fetchData()
    const fetchContingencies = async () => {
      try {
        const res = await customFetch<ContingencyPlansResponse>(
          `itineraries/${id}/contingencies`,
          {
            credentials: 'include',
          }
        )

        if (res.statusCode === 404) {
          setIsNotFound(true)
        }

        setContingencies(res.contingencies)
      } catch (err: any) {
        setIsNotFound(true)
      }
    }
    void fetchContingencies()
  }, [id])

  useEffect(() => {
    if (!contingencyId) {
      setSelectedContingency(undefined)
      return
    }
    const fetchContingencyDetail = async () => {
      try {
        const res = await customFetch<ContingencyPlanResponse>(
          `itineraries/${id}/contingencies/${contingencyId}`,
          {
            credentials: 'include',
          }
        )

        if (res.statusCode === 404) {
          setIsNotFound(true)
        }

        const mappedSections = res.contingency.sections.map((section) => ({
          ...section,
          sectionNumber: section.sectionNumber % 1000,
        }))

        setSelectedContingency({ ...res.contingency, sections: mappedSections })
      } catch (err: any) {
        setIsNotFound(true)
      }
    }
    void fetchContingencyDetail()
  }, [contingencyId])

  useEffect(() => {
    const viewItinerary = async () => {
      try {
        await customFetch(`itineraries/views/${id}`, {
          method: 'POST',
        })
      } catch (err: any) {
        console.error('Error viewing itinerary:', err)
      }
    }
    if (isAuthenticated && data?.isPublished) {
      void viewItinerary()
    } else if (data && !data?.isPublished && data?.user?.id !== user?.id) {
      router.push('/')
      toast.error('Itinerary ini merupakan itinerary pribadi')
    }
  }, [data, data?.isPublished, id, isAuthenticated, router])

  if (isNotFound) {
    return <NotFound />
  }
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

  return data ? (
    <APIProvider apiKey={apiKey}>
      <div className="flex max-h-screen">
        <div className="container max-w-4xl mx-auto p-4 pt-24 min-h-screen max-h-screen overflow-auto">
          <ItineraryHeader
            data={
              selectedContingency
                ? {
                    ...data,
                    title: `(${selectedContingency.title}) ${data.title}`,
                  }
                : data
            }
            contingencyId={contingencyId}
            refresh={fetchData}
          />
          <ItinerarySummary startDate={data.startDate} endDate={data.endDate} />
          <ItineraryList
            section={
              selectedContingency
                ? selectedContingency.sections || []
                : data.sections || []
            }
          />
          <PlanPicker
            itineraryId={id}
            contingencies={contingencies || []}
            selectedPlan={selectedContingency ?? data}
          />
        </div>
        <div className="w-full min-h-screen hidden md:block">
          <Maps
            itineraryData={
              selectedContingency
                ? selectedContingency.sections || []
                : (data.sections ?? [])
            }
          />
        </div>
      </div>
    </APIProvider>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin w-6 h-6 mr-2" />
    </div>
  )
}
