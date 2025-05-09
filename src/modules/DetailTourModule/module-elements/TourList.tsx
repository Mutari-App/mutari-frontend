'use client'
import { TourDay } from './TourDay'

export const TourList = ({ section }: { section: Section[] }) => {
  if (!section || section.length === 0) return null

  return (
    <div className="justify-center p-4">
      {section.map((day) => (
        <TourDay key={day.id} section={day} />
      ))}
    </div>
  )
}
