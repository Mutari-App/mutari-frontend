import DetailItineraryModule from '@/modules/DetailItineraryModule'
import { fetchItineraryData } from '@/lib/api/fetchItineraryData'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const awaitedParams = await params
  const itineraryData = await fetchItineraryData(awaitedParams.id)

  return {
    title: itineraryData.title,
    description: itineraryData.description || 'Lihat itinerary ini!',
    openGraph: {
      title: itineraryData.title,
      description: itineraryData.description || 'Lihat itinerary ini!',
      images: [
        {
          url: itineraryData.coverImage || '/default-image.jpg',
          width: 1200,
          height: 630,
        },
      ],
      url: `https://mutari.id/itinerary/${awaitedParams.id}`,
      type: 'website',
    },
  }
}

export default function ItineraryDetailPage() {
  return <DetailItineraryModule />
}
