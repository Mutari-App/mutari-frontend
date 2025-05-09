'use client'

import { useState } from 'react'
import { UsersRound } from 'lucide-react'

export const TourDescription = ({
  title,
  description,
  maxCapacity,
}: {
  title: string
  description: string
  maxCapacity: number
}) => {
  const [expanded, setExpanded] = useState(false)
  const shortDesc = description.split(' ').slice(0, 30).join(' ') + '...'

  return (
    <div className="text-sm text-gray-700 space-y-2">
      <h2 className="text-base font-semibold">{title}</h2>

      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <UsersRound className="text-gray-500" />
        <span>Open trip sampai {maxCapacity} orang</span>
      </div>

      <p className="whitespace-pre-line">
        {expanded ? description : shortDesc}
      </p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-600 hover:underline mt-1"
      >
        {expanded ? 'Sembunyikan deskripsi' : 'Tampilkan deskripsi'}
      </button>
    </div>
  )
}
