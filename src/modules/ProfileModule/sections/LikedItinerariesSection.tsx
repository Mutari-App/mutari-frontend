'use client'

import { useState, useEffect } from 'react'
import ItineraryCard from '../module-elements/ItineraryCard'
import { customFetch } from '@/utils/newCustomFetch'
import {
  GetItineraryLikesProps,
  ItineraryProps,
  ProfileModuleProps,
} from '../interface'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'

export const LikedItinerariesSection: React.FC<ProfileModuleProps> = ({
  profile,
}) => {
  const [itineraries, setItineraries] = useState<ItineraryProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const getItineraries = async () => {
    try {
      setLoading(true)
      const response = await customFetch<GetItineraryLikesProps>(
        `/profile/${profile.id}/itinerary-likes`
      )

      if (response.statusCode !== 200) {
        throw new Error('Terjadi kesalahan saat mengambil data itineraries')
      }

      setItineraries(response.itineraryLikes)
    } catch (err: any) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void getItineraries()
  }, [])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center">
          <Loader className="animate-spin" />
        </div>
      )
    }

    if (itineraries.length > 0) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 w-full">
          {itineraries.map((itinerary) => (
            <ItineraryCard key={itinerary.id} itinerary={itinerary} />
          ))}
        </div>
      )
    }

    return <p className="italic">Belum ada itinerary</p>
  }

  return (
    <section className="mx-auto pt-3 pb-6 w-full">
      <div className="flex w-full justify-between items-center pb-5">
        <h2 className="font-semibold font-poppins text-xl md:text-2xl text-center">
          Wishlists
        </h2>
      </div>
      {renderContent()}
    </section>
  )
}
