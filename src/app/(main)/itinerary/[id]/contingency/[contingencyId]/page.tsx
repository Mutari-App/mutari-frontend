import DetailItineraryModule from '@/modules/DetailItineraryModule'
import type { Metadata } from 'next'

export function generateMetadata(): Metadata {
  return {
    title: 'Itinerary Contingency details',
  }
}

export default function ItineraryContingencyDetailPage() {
  return <DetailItineraryModule />
}
