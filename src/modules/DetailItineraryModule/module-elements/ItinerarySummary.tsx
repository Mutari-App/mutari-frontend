'use client'
import { Calendar } from 'lucide-react'

export const ItinerarySummary = ({
  startDate,
  endDate,
}: {
  startDate: string
  endDate: string
}) => {
  if (!startDate || !endDate) return null

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
    })

  return (
    <div className="flex items-center gap-2 text-[#024C98] font-roboto font-medium text-lg mt-2">
      <Calendar size={20} />
      <span className="font-bold">
        {formatDate(startDate)} - {formatDate(endDate)}
      </span>
    </div>
  )
}
