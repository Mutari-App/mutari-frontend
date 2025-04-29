'use client'
import React from 'react'
import ItineraryCard from '../module-elements/ItineraryCard'
import type { ItineraryData, metadataType } from '../module-elements/types'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function MyItineraryList({
  data,
  metadata,
  refresh,
  searchQueryParams,
  includePagination = true,
}: {
  readonly data: readonly Readonly<ItineraryData>[]
  readonly metadata: metadataType
  readonly refresh: () => void
  readonly searchQueryParams: string
  readonly includePagination?: boolean
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  function handleSearchparams(value: string) {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(searchQueryParams, value)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {data.map((item) => (
            <ItineraryCard item={item} key={item.id} refresh={refresh} />
          ))}
        </div>
      ) : (
        <div className="w-full flex items-center justify-center py-8">
          Belum ada rencana perjalanan.
        </div>
      )}
      {includePagination && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (metadata.page > 1) {
                    const newPage = metadata.page - 1
                    handleSearchparams(newPage.toString())
                  }
                }}
                className={
                  metadata.page <= 1 ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>

            {/* First page */}
            {metadata.totalPages > 0 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={metadata.page === 1}
                  onClick={(e) => {
                    e.preventDefault()
                    handleSearchparams('1')
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Ellipsis if needed */}
            {metadata.page > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Pages around current page */}
            {Array.from({ length: metadata.totalPages })
              .slice(1, -1)
              .map((_, i) => {
                const page = i + 2
                // Show only pages close to current page
                if (page >= metadata.page - 1 && page <= metadata.page + 1) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === metadata.page}
                        onClick={(e) => {
                          e.preventDefault()
                          handleSearchparams(page.toString())
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
                return null
              })
              .filter(Boolean)}

            {/* Ellipsis if needed */}
            {metadata.page < metadata.totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Last page */}
            {metadata.totalPages > 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={metadata.page === metadata.totalPages}
                  onClick={(e) => {
                    e.preventDefault()
                    handleSearchparams(metadata.totalPages.toString())
                  }}
                >
                  {metadata.totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (metadata.page < metadata.totalPages) {
                    // Update to next page
                    const newPage = metadata.page + 1
                    handleSearchparams(newPage.toString())
                  }
                }}
                className={
                  metadata.page >= metadata.totalPages
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default MyItineraryList
