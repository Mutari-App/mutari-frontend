import ItineraryMakerModule from '@/modules/ItineraryMakerModule'
import React from 'react'
import type { Metadata } from 'next'

export function generateMetadata(): Metadata {
  return {
    title: 'Editing Itinerary',
  }
}

export default function EditItineraryPage() {
  return <ItineraryMakerModule />
}
