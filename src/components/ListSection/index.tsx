import React from 'react'
import LoadingSkeleton from '../LoadingSkeleton'
import NoResults from '../NoResults'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface ListSectionProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  isLoading: boolean
  currentPage: number
  totalPages: number
  totalResults: number
  onPageChange: (page: number) => void
  searchQuery: string
  onResetSearch: () => void
  searchType?: string
  additionalProps?: Record<string, any>
}

const ListSection = <T extends { id: string }>({
  items,
  renderItem,
  isLoading,
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
  searchQuery,
  onResetSearch,
  searchType,
}: ListSectionProps<T>) => {
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          <LoadingSkeleton count={6} />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <NoResults
          query={searchQuery}
          searchType={searchType}
          onReset={onResetSearch}
        />
      </div>
    )
  }

  // Helper function to generate visible page numbers
  const getVisiblePages = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 480
    const delta = isMobile ? 1 : 2
    const pages: (number | 'ellipsis')[] = []
    // Always show first page
    pages.push(1)
    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta)
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta)
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push('ellipsis')
    }
    // Add pages in the calculated range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i)
    }
    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('ellipsis')
    }
    // Only show the last page if it's reasonably close to current page
    if (currentPage > totalPages - 4 && totalPages > 1) {
      pages.push(totalPages)
    }
    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 flex flex-col min-h-[calc(100vh-160px)] sm:min-h-[calc(100vh-180px)] md:min-h-[calc(100vh-200px)] lg:min-h-[calc(100vh-230px)]">
      {searchQuery && (
        <div className="mb-4 sm:mb-6 text-sm text-gray-600">
          {totalResults.toLocaleString()} hasil untuk &quot;{searchQuery}&quot;
        </div>
      )}

      <div className="flex-grow">
        <div className="grid grid-cols-2 gap-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => renderItem(item, index))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-auto pt-6 md:pt-10">
          <Pagination>
            <PaginationContent className="flex-wrap justify-center gap-1 sm:gap-0">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  className={`${currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                  aria-disabled={currentPage <= 1}
                />
              </PaginationItem>
              <div className="hidden min-[480px]:flex">
                {visiblePages.map((page, index) => (
                  <PaginationItem key={`page-${page}-${index}`}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => onPageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
              </div>
              <div className="flex min-[480px]:hidden items-center px-2">
                <span className="text-sm">{currentPage}</span>
              </div>
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={`${currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                  aria-disabled={currentPage >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default ListSection
