'use client'
import { customFetch } from '@/utils/newCustomFetch'
import { ItineraryHeader } from './module-elements/ItineraryHeader'
import { ItineraryList } from './module-elements/ItineraryList'
import { ItinerarySummary } from './module-elements/ItinerarySummary'
import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Maps from '../ItineraryMakerModule/sections/Maps'
import { PlanPicker } from './module-elements/PlanPicker'
import { Loader2 } from 'lucide-react'

export default function DetailItineraryModule() {
  const [data, setData] = useState<Itinerary | null>(null)
  const [contingencies, setContingencies] = useState<ContingencyPlan[]>()
  const [selectedContingency, setSelectedContingency] =
    useState<ContingencyPlan>()
  const [isNotFound, setIsNotFound] = useState(false)
  const { id, contingencyId } = useParams<{
    id: string
    contingencyId: string
  }>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await customFetch<ItineraryDetailResponse>(
          `/itineraries/${id}`,
          {
            credentials: 'include',
          }
        )
        console.log(res)

        if (res.statusCode === 404 || res.statusCode === 403) {
          setIsNotFound(true)
        }

        setData(res.data)
      } catch (err: any) {
        setIsNotFound(true)
      }
    }
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

  if (isNotFound) {
    notFound()
  }

  return data ? (
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
  ) : (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin w-6 h-6 mr-2" />
    </div>
  )
}
