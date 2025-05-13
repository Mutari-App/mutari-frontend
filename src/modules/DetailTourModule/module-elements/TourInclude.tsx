'use client'

import { Home, Bus, Ticket, Utensils, Users } from 'lucide-react'
import { type JSX } from 'react'

const iconMap: Record<string, JSX.Element> = {
  ticket: <Ticket className="text-blue-500" />,
  utensils: <Utensils className="text-blue-500" />,
  home: <Home className="text-blue-500" />,
  bus: <Bus className="text-blue-500" />,
  users: <Users className="text-blue-500" />,
}

export const TourInclude = ({ includes }: { includes: Include[] }) => {
  return (
    <div>
      <h3 className="text-base font-semibold mb-2">Sudah Termasuk</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {includes.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            {iconMap[item.icon] || <span className="w-4" />}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
