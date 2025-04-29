'use client'

import { useState, useEffect } from 'react'
import ItineraryCard from '../module-elements/ItineraryCard'
import { customFetch } from '@/utils/newCustomFetch'
import {
  GetItinerariesProps,
  ItineraryProps,
  ProfileModuleProps,
} from '../interface'
import { toast } from 'sonner'
import { Loader, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuthContext } from '@/contexts/AuthContext'

export const ItinerariesSection: React.FC<ProfileModuleProps> = ({
  profile,
}) => {
  const { user } = useAuthContext()
  const [itineraries, setItineraries] = useState<ItineraryProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const getItineraries = async () => {
    try {
      setLoading(true)
      const response = await customFetch<GetItinerariesProps>(
        `/profile/${profile.id}/itineraries`
      )

      if (response.statusCode !== 200) {
        throw new Error('Terjadi kesalahan saat mengambil data itineraries')
      }

      setItineraries(response.itineraries)
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
    <section className="mx-auto pb-6 pt-3 w-full">
      <div className="flex flex-col md:flex-row gap-2  w-full justify-between items-center pb-5">
        <h2 className="font-semibold font-poppins text-center text-xl md:text-2xl">
          Rencana Perjalanan
        </h2>
        {user?.id === profile.id && (
          <Link href={'/itinerary/create'}>
            <Button
              size={'sm'}
              className="bg-gradient-to-r from-[#016CD7] to-[#014285] text-white items-center flex gap-3"
            >
              <PlusIcon />
              Buat Itinerary Baru
            </Button>
          </Link>
        )}
      </div>
      {renderContent()}
    </section>
  )
}
