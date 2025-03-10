'use client'
import { ItineraryDay } from './ItineraryDay'

export const ItineraryList = ({ section }: { section: Section[] }) => {
  if (!section || section.length === 0) return null
  return (
    <div className="justify-center p-4">
      {section.map((day, index) => (
        <ItineraryDay key={index} section={day} />
      ))}
    </div>
  )
}
