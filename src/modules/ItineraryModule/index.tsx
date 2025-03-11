'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import MyItineraryList from './sections/MyItineraryList'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import Image from 'next/image'
import { getImage } from '@/utils/getImage'
import CompletedItineraryList from './sections/CompletedItineraryList'
import { customFetch } from '@/utils/customFetch'
import type {
  CompletedItineraryResponse,
  ItineraryData,
  ItineraryResponse,
  metadataType,
} from './module-elements/types'
import { toast } from 'sonner'

export default function ItineraryModule() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') ?? 1
  const router = useRouter()

  const defaultMetadata = {
    page: 1,
    totalPages: 1,
    total: 0,
  }
  const [data, setData] = useState<ItineraryData[]>([])
  const [completedData, setCompletedData] = useState<ItineraryData[]>([])
  const [metadata, setMetadata] = useState<metadataType>(defaultMetadata)

  const refreshAll = async () => {
    await fetchMyItinerary()
    await fetchMyCompletedItinerary()
  }

  const fetchMyItinerary = async () => {
    try {
      const res = await customFetch<ItineraryResponse>(
        `/itineraries/me?page=${page}`
      )
      if (res.statusCode !== 200) throw new Error(res.message)
      setData(res.itinerary.data)
      setMetadata(res.itinerary.metadata)
      console.log(res)
    } catch (err: any) {
      console.log(err)
      if (err instanceof Error)
        toast.error(`${err.message}`, {
          richColors: true,
        })
    }
  }

  const fetchMyCompletedItinerary = async () => {
    try {
      const res = await customFetch<CompletedItineraryResponse>(
        `/itineraries/me/completed`
      )
      if (res.statusCode !== 200) throw new Error(res.message)
      setCompletedData(res.itinerary)
      console.log(res.itinerary)
    } catch (err: any) {
      console.log(err)
      if (err instanceof Error)
        toast.error(`${err.message}`, {
          richColors: true,
        })
    }
  }

  useEffect(() => {
    fetchMyCompletedItinerary().catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    fetchMyItinerary().catch((err) => console.log(err))
  }, [page])

  useEffect(() => {
    if (!searchParams.get('page')) {
      router.replace(`/itinerary?page=1`)
    }
  }, [searchParams, router])

  return (
    <div className="flex flex-col items-center gap-7 pt-28">
      <div className="flex flex-col items-center gap-7 px-5 w-full lg:w-4/5">
        <h1 className="font-semibold text-2xl text-center md:text-left md:text-[36px] self-start">
          Rencana Perjalanan Saya
        </h1>
        <Link href={'/itinerary/create'} className="w-full md:w-1/3">
          <Button className="bg-gradient-to-r from-[#016CD7] to-[#014285] text-white items-center flex gap-3 w-full">
            <PlusIcon />
            Buat Itinerary Baru
          </Button>
        </Link>
        <MyItineraryList data={data} metadata={metadata} refresh={refreshAll} />

        <div className="flex flex-col justify-start gap-7 w-full">
          <h1 className="font-semibold text-2xl md:text-left md:text-[36px] sel">
            Perjalanan Selesai
          </h1>
          <CompletedItineraryList data={completedData} refresh={refreshAll} />
        </div>
      </div>
      <div className="text-center text-sm">
        <p>
          <span className="font-bold text-blue-500">LELAH</span> membuat rencana
          perjalanan dari nol?
        </p>
        <p>Coba jelajahi itinerary yang dibuat oleh pengguna!</p>
      </div>
      <Image
        src={getImage('section-break-bg.png')}
        alt=""
        width={720}
        height={720}
        className="w-screen"
      />
    </div>
  )
}
