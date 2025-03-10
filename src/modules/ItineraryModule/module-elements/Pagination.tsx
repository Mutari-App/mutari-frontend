import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRightIcon } from 'lucide-react'
import type { metadataType } from './types'
import { generatePageNumbers } from './utils'

export const Pagination = (props: metadataType) => {
  const { totalPages, page } = props
  const isFirstPage = page == 1
  const isLastPage = page >= totalPages

  return (
    <div className="flex gap-3 items-center self-center">
      {isFirstPage ? (
        <button
          className={`p-2 w-8 text-white rounded-md bg-gray-400 cursor-not-allowed`}
          disabled
          data-testid="prev-btn"
        >
          <ChevronLeft size={16} />
        </button>
      ) : (
        <Link
          className={`p-2 w-8 text-white rounded-md bg-black hover:bg-black/70`}
          href={`?page=${page - 1}`}
          data-testid="prev-link"
        >
          <ChevronLeft size={16} />
        </Link>
      )}

      {generatePageNumbers(page, totalPages).map((p) =>
        p === '...' ? (
          <span key={p} className="px-2">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={`?page=${p}`}
            className={`text-black p-2 w-8 text-xs text-center font-medium border rounded-md ${
              page === p
                ? 'bg-[#0059B3] text-white hover:bg-[#0059B3]/80'
                : 'hover:bg-black/5'
            }`}
          >
            {p}
          </Link>
        )
      )}

      {isLastPage ? (
        <button
          className={`p-2 w-8 text-white rounded-md bg-gray-400 cursor-not-allowed`}
          disabled
          data-testid="next-btn"
        >
          <ChevronRightIcon size={16} />
        </button>
      ) : (
        <Link
          className={`p-2 w-8 text-white rounded-md bg-black hover:bg-black/70`}
          href={`?page=${page + 1}`}
          data-testid="next-link"
        >
          <ChevronRightIcon size={16} />
        </Link>
      )}
    </div>
  )
}
