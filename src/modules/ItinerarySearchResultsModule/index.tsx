'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import HeaderSection from './sections/HeaderSection'
import ItineraryListSection from './sections/ItineraryListSection'
import { customFetch, customFetchBody } from '@/utils/newCustomFetch'
import {
  type BatchCheckItinerarySavedResponse,
  type ItineraryFilters,
  type ItinerarySearchResult,
  type SearchItinerariesResponse,
} from './interface'
import { toast } from 'sonner'

const ItinerarySearchResultsModule = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [itineraries, setItineraries] = useState<ItinerarySearchResult[]>([])
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  const [itinerariesLiked, setItinerariesLiked] = useState<{
    [key: string]: boolean
  }>({})
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1
  )
  const [totalResults, setTotalResults] = useState(0)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')
  const [filters, setFilters] = useState<ItineraryFilters>({
    tags: searchParams.get('tags') ?? '',
    minDaysCount: searchParams.get('minDaysCount') ?? '',
    maxDaysCount: searchParams.get('maxDaysCount') ?? '',
    sortBy: (searchParams.get('sortBy') as ItineraryFilters['sortBy']) ?? '',
    order: (searchParams.get('order') as ItineraryFilters['order']) ?? '',
  })

  const fetchItineraries = useCallback(async () => {
    try {
      setIsLoading(true)

      const params = new URLSearchParams()
      params.append('q', searchQuery)
      params.append('page', currentPage.toString())

      if (filters.tags) params.append('tags', filters.tags)
      if (filters.minDaysCount)
        params.append('minDaysCount', filters.minDaysCount)
      if (filters.maxDaysCount)
        params.append('maxDaysCount', filters.maxDaysCount)
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.order) params.append('order', filters.order)

      const response = await customFetch<SearchItinerariesResponse>(
        `/itineraries/search?${params}`,
        {
          method: 'GET',
        }
      )

      const itineraryIds = response.data.map((itinerary) => itinerary.id)
      const responseLikes = await customFetch<BatchCheckItinerarySavedResponse>(
        `/itineraries/checkSave`,
        {
          method: 'POST',
          body: customFetchBody(itineraryIds),
          credentials: 'include',
        }
      )
      setItinerariesLiked(responseLikes.result)

      setItineraries(response.data)
      setTotalPages(response.metadata.totalPages)
      setTotalResults(response.metadata.total)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Gagal memuat hasil pencarian')
      setItineraries([])
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, filters, currentPage])

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (currentPage > 1) params.set('page', currentPage.toString())
    if (filters.tags) params.set('tags', filters.tags)
    if (filters.minDaysCount) params.set('minDaysCount', filters.minDaysCount)
    if (filters.maxDaysCount) params.set('maxDaysCount', filters.maxDaysCount)
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.order) params.set('order', filters.order)

    router.push(`/itinerary/search?${params.toString()}`)
  }, [router, searchQuery, filters, currentPage])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilters: ItineraryFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const handleResetSearch = () => {
    setSearchQuery('')
    setFilters({
      tags: '',
      minDaysCount: '',
      maxDaysCount: '',
      sortBy: '',
      order: '',
    })
    setCurrentPage(1)
  }

  useEffect(() => {
    updateUrl()
    void fetchItineraries()
  }, [filters, currentPage, searchQuery, updateUrl, fetchItineraries])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderSection
        searchQuery={searchQuery}
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <ItineraryListSection
        itineraries={itineraries}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        onPageChange={handlePageChange}
        searchQuery={searchQuery}
        onResetSearch={handleResetSearch}
        itinerariesLiked={itinerariesLiked}
      />
    </div>
  )
}

export default ItinerarySearchResultsModule
