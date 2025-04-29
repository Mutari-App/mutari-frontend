'use client'
import { Button } from '@/components/ui/button'
import {
  ItineraryData,
  ItineraryResponse,
  metadataType,
} from '@/modules/ItineraryModule/module-elements/types'
import MyItineraryList from '@/modules/ItineraryModule/sections/MyItineraryList'
import { customFetch } from '@/utils/newCustomFetch'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function MyItinerarySection() {
  const router = useRouter()
  const [data, setData] = useState<ItineraryData[]>([])
  const [myItineraryMetadata, setMyItineraryMetadata] = useState<metadataType>({
    page: 1,
    totalPages: 0,
    total: 0,
  })

  const fetchMyItinerary = async () => {
    try {
      const res = await customFetch<ItineraryResponse>(`/itineraries/me?page=1`)
      if (res.statusCode === 401) return
      if (res.statusCode !== 200) throw new Error(res.message)
      setData(res.itinerary.data)
      setMyItineraryMetadata(res.itinerary.metadata)
      console.log('data', res.itinerary.data)
    } catch (err: any) {
      if (err instanceof Error) toast.error(`${err.message}`)
    }
  }
  useEffect(() => {
    fetchMyItinerary().catch((err) => console.log(err))
  }, [])

  return (
    <div className="flex flex-col justify-start lg:justify-between w-4/5 gap-5">
      <div className="flex flex-col lg:flex-row gap-5 justify-between items-center w-full">
        <h2 className="font-semibold text-2xl md:text-left md:text-[36px] md:text-left  self-start">
          Rencana Perjalanan Saya
        </h2>
        <Link
          href={'/itinerary/create'}
          className="w-3/4 lg:w-auto self-center lg:self-end"
        >
          <Button className="bg-gradient-to-r from-[#016CD7] to-[#014285] text-white items-center flex gap-3 w-full">
            <PlusIcon />
            Buat Itinerary Baru
          </Button>
        </Link>
      </div>
      <MyItineraryList
        data={data}
        metadata={myItineraryMetadata}
        refresh={fetchMyItinerary}
        searchQueryParams="myItineraryPage"
        includePagination={false}
      />
      {data && data.length > 0 && (
        <div className="flex justify-center">
          <Button
            onClick={() => router.push('/itinerary')}
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-[#016CD7] to-[#014285] text-white items-center flex gap-3 w-full md:w-3/4 lg:w-1/2"
          >
            Lihat Lebih Banyak
          </Button>
        </div>
      )}
    </div>
  )
}
