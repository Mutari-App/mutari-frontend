'use client'

import ItineraryModule from '@/modules/ItineraryModule'
import NewItineraryModule from '@/modules/NewItineraryModule'
import { useEffect, useState, useRef } from 'react'

export default function ItineraryPage() {
  const [variant, setVariant] = useState<'A' | 'B' | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const variantRef = useRef<'A' | 'B' | null>(null)

  useEffect(() => {
    // Check if variant is already stored in localStorage
    const storedVariant = localStorage.getItem('itineraryVariant')
    let finalVariant: 'A' | 'B'

    if (storedVariant === 'A' || storedVariant === 'B') {
      // Use the stored variant
      finalVariant = storedVariant
    } else {
      const showNewVariant = Math.random() < 0.5
      finalVariant = showNewVariant ? 'B' : 'A'
      localStorage.setItem('itineraryVariant', finalVariant)
    }

    setVariant(finalVariant)
    variantRef.current = finalVariant

    // Catat waktu mulai
    startTimeRef.current = Date.now()

    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track('view-itinerary', { variant: finalVariant })
    }

    // Fungsi untuk tracking durasi kunjungan
    const trackTimeSpent = () => {
      if (
        startTimeRef.current &&
        variantRef.current &&
        typeof window !== 'undefined' &&
        window.umami
      ) {
        const timeSpent = (Date.now() - startTimeRef.current) / 1000 // dalam detik
        window.umami.track('itinerary-time-spent', {
          ...(variantRef.current === 'A'
            ? { itineraryListVariantA: timeSpent }
            : { itineraryListVariantB: timeSpent }),
        })
      }
    }

    // Track waktu ketika user meninggalkan halaman
    window.addEventListener('beforeunload', trackTimeSpent)

    // Clean up
    return () => {
      window.removeEventListener('beforeunload', trackTimeSpent)
      // Track waktu ketika navigasi dalam aplikasi
      trackTimeSpent()
    }
  }, [])

  if (variant === null) return null

  return variant === 'A' ? <ItineraryModule /> : <NewItineraryModule />
}
