'use client'

import ItineraryModule from '@/modules/ItineraryModule'
import NewItineraryModule from '@/modules/NewItineraryModule'
import { useEffect, useState } from 'react'

export default function ItineraryPage() {
  const [variant, setVariant] = useState<'A' | 'B' | null>(null)

  useEffect(() => {
    // Check if variant is already stored in localStorage
    const storedVariant = localStorage.getItem('itineraryVariant')

    if (storedVariant === 'A' || storedVariant === 'B') {
      // Use the stored variant
      setVariant(storedVariant as 'A' | 'B')
    } else {
      // Generate a new variant and store it
      const showNewVariant = Math.random() < 0.5
      const newVariant = showNewVariant ? 'B' : 'A'
      setVariant(newVariant)
      localStorage.setItem('itineraryVariant', newVariant)
    }
  }, [])

  if (variant === null) return null

  // Return the appropriate component based on the variant
  return variant === 'A' ? <ItineraryModule /> : <NewItineraryModule />
}
