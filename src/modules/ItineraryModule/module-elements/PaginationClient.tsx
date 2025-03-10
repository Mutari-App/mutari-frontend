import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRightIcon } from 'lucide-react'
import type { clientMetadataType } from './types'
import { generatePageNumbers } from './utils'

export const PaginationClient = (props: clientMetadataType) => {
  const { totalPages, page, setPage } = props
  const isFirstPage = page == 1
  const isLastPage = page >= totalPages

  const handlePrev = () => {
    if (!isFirstPage) {
      setPage(page - 1)
    }
  }

  const handleNext = () => {
    if (!isLastPage) {
      setPage(page + 1)
    }
  }


  return (
    <div className="flex gap-3 items-center self-center">
      <button
        className={`p-2 w-8 text-white rounded-md ${isFirstPage ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-black/70'}`}
        disabled={isFirstPage}
        onClick={handlePrev}
      >
        <ChevronLeft size={16} />
      </button>

      {generatePageNumbers(page, totalPages).map((p) =>
        p === '...' ? (
          <span key={p} className="px-2">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => setPage(Number(p))}
            className={`text-black p-2 w-8 text-xs text-center font-medium border rounded-md ${
              page === p
                ? 'bg-[#0059B3] text-white hover:bg-[#0059B3]/80'
                : 'hover:bg-black/5'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        className={`p-2 w-8 text-white rounded-md ${isLastPage ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-black/70'}`}
        disabled={isLastPage}
        onClick={handleNext}
      >
        <ChevronRightIcon size={16} />
      </button>
    </div>
  )
}
