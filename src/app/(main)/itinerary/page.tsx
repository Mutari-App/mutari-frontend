import ItineraryModule from '@/modules/ItineraryModule'
import type { Metadata } from 'next'

export function generateMetadata(): Metadata {
  return {
    title: 'Itinerary',
  }
}

export default function Home() {
  return <ItineraryModule />
}
