import ItineraryMakerModule from '@/modules/ItineraryMakerModule'
import React from 'react'
import type { Metadata } from 'next'

export function generateMetadata(): Metadata {
  return {
    title: 'Creating Itinerary Contingency',
  }
}

export default function CreateItineraryContingencyPage() {
  return <ItineraryMakerModule isContingency={true} />
}
