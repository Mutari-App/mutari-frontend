'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import HeaderSection from './sections/HeaderSection'
import TourListSection from './sections/TourListSection'
import { customFetch } from '@/utils/newCustomFetch'
import {
  type TourFilters,
  type TourSearchResult,
  type SearchToursResponse,
} from './interface'
import { toast } from 'sonner'

const TourSearchResultsModule = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [tours, setTours] = useState<TourSearchResult[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1
  )
  const [totalResults, setTotalResults] = useState(0)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '')
  const [filters, setFilters] = useState<TourFilters>({
    location: searchParams.get('location') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    minDuration: searchParams.get('minDuration') ?? '',
    maxDuration: searchParams.get('maxDuration') ?? '',
    durationType: searchParams.get('durationType') ?? '',
    hasAvailableTickets: searchParams.get('hasAvailableTickets') === 'true',
    sortBy: (searchParams.get('sortBy') as TourFilters['sortBy']) ?? '',
    order: (searchParams.get('order') as TourFilters['order']) ?? '',
  })

  const fetchTours = useCallback(async () => {
    try {
      setIsLoading(true)

      const params = new URLSearchParams()
      params.append('q', searchQuery)
      params.append('page', currentPage.toString())

      if (filters.location) params.append('location', filters.location)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.minDuration) params.append('minDuration', filters.minDuration)
      if (filters.maxDuration) params.append('maxDuration', filters.maxDuration)
      if (filters.durationType)
        params.append('durationType', filters.durationType)
      if (filters.hasAvailableTickets)
        params.append('hasAvailableTickets', 'true')
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.order) params.append('order', filters.order)

      const response = await customFetch<SearchToursResponse>(
        `/tour/search?${params}`,
        {
          method: 'GET',
        }
      )
      console.log(response)

      setTours(response.data)
      setTotalPages(response.metadata.totalPages)
      setTotalResults(response.metadata.total)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Gagal memuat hasil pencarian')
      setTours([])
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, filters, currentPage])

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (currentPage > 1) params.set('page', currentPage.toString())
    if (filters.location) params.set('location', filters.location)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.minDuration) params.set('minDuration', filters.minDuration)
    if (filters.maxDuration) params.set('maxDuration', filters.maxDuration)
    if (filters.durationType) params.set('durationType', filters.durationType)
    if (filters.hasAvailableTickets) params.set('hasAvailableTickets', 'true')
    if (filters.sortBy) params.set('sortBy', filters.sortBy)
    if (filters.order) params.set('order', filters.order)

    router.push(`/tour/search?${params.toString()}`)
  }, [router, searchQuery, filters, currentPage])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilters: TourFilters) => {
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
      location: '',
      minPrice: '',
      maxPrice: '',
      minDuration: '',
      maxDuration: '',
      durationType: '',
      hasAvailableTickets: false,
      sortBy: '',
      order: '',
    })
    setCurrentPage(1)
  }

  useEffect(() => {
    updateUrl()
    void fetchTours()
  }, [filters, currentPage, searchQuery, updateUrl, fetchTours])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderSection
        searchQuery={searchQuery}
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <TourListSection
        tours={tours}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        onPageChange={handlePageChange}
        searchQuery={searchQuery}
        onResetSearch={handleResetSearch}
      />
    </div>
  )
}

export default TourSearchResultsModule
