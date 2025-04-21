'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import HeaderSection from './sections/HeaderSection'
import ItineraryListSection from './sections/ItineraryListSection'
import { customFetch } from '@/utils/newCustomFetch'
import {
  type ItineraryFilters,
  type ItinerarySearchResult,
  type SearchItinerariesResponse,
} from './interface'

const ItinerarySearchResultsModule = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [itineraries, setItineraries] = useState<ItinerarySearchResult[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')
  const [filters, setFilters] = useState<ItineraryFilters>({
    tags: searchParams.get('tags') ?? '',
    startDate: searchParams.get('startDate') ?? '',
    endDate: searchParams.get('endDate') ?? '',
    sortBy:
      (searchParams.get('sortBy') as ItineraryFilters['sortBy']) ?? 'startDate',
    order: (searchParams.get('order') as ItineraryFilters['order']) ?? 'asc',
  })

  const fetchItineraries = async () => {
    try {
      setIsLoading(true)

      const params = new URLSearchParams()
      params.append('q', searchQuery)
      params.append('page', currentPage.toString())

      if (filters.tags) params.append('tags', filters.tags)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.order) params.append('order', filters.order)

      const response = await customFetch<SearchItinerariesResponse>(
        `/itineraries/search?${params}`,
        {
          method: 'GET',
        }
      )

      setItineraries(response.data.data)
      setTotalPages(response.data.metadata.totalPages)
    } catch (error) {
      console.error('Error fetching itineraries:', error)
      setItineraries([])
    } finally {
      setIsLoading(false)
    }
  }

  const updateUrl = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (filters.tags) params.set('tags', filters.tags)
    if (filters.startDate) params.set('startDate', filters.startDate)
    if (filters.endDate) params.set('endDate', filters.endDate)
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.order) params.set('order', filters.order)

    router.push(`/itinerary/search?${params.toString()}`)
  }

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

  useEffect(() => {
    updateUrl()
    void fetchItineraries()
  }, [searchQuery, filters, currentPage])

  return (
    <div className="min-h-screen bg-gray-50">
      {/*
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
        onPageChange={handlePageChange}
      />
      */}
    </div>
  )
}

export default ItinerarySearchResultsModule
