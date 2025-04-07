import DetailItineraryModule from '@/modules/DetailItineraryModule'
import type { Metadata } from 'next'

export function generateMetadata(): Metadata {
  return {
    title: 'Itinerary details',
  }
}

export default function ItineraryDetailPage() {
  return <DetailItineraryModule />
}
