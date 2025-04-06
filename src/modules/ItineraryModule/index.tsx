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

  const defaultMetadata = {
    page: 1,
    totalPages: 1,
    total: 0,
  }
  const [data, setData] = useState<ItineraryData[]>([])
  const [sharedData, setSharedData] = useState<ItineraryData[]>([])
  const [completedData, setCompletedData] = useState<ItineraryData[]>([])
  const [metadata, setMetadata] = useState<metadataType>(defaultMetadata)

  const refreshAll = async () => {
    await fetchMyItinerary()
    await fetchMyCompletedItinerary()
    await fetchMySharedItinerary()
  }

  const fetchMyItinerary = async () => {
    try {
      const res = await customFetch<ItineraryResponse>(
        `/itineraries/me?page=${page}`,
        { isAuthorized: true }
      )
      if (res.statusCode === 401) return

      if (res.statusCode !== 200) throw new Error(res.message)
      setData(res.itinerary.data)
      setMetadata(res.itinerary.metadata)
    } catch (err: any) {
      if (err instanceof Error) toast.error(`${err.message}`)
    }
  }

  const fetchMySharedItinerary = async () => {
    try {
      const res = await customFetch<ItineraryResponse>(
        `/itineraries/me/shared?page=${page}`,
        { isAuthorized: true }
      )
      if (res.statusCode === 401) return

      if (res.statusCode !== 200) throw new Error(res.message)
      setSharedData(res.itinerary.data)
      setMetadata(res.itinerary.metadata)
    } catch (err: any) {
      if (err instanceof Error) toast.error(`${err.message}`)
    }
  }

  const fetchMyCompletedItinerary = async () => {
    try {
      const res = await customFetch<CompletedItineraryResponse>(
        `/itineraries/me/completed`,
        {
          isAuthorized: true,
        }
      )
      if (res.statusCode === 401) return
      if (res.statusCode !== 200) throw new Error(res.message)
      setCompletedData(res.itinerary)
    } catch (err: any) {
      if (err instanceof Error) toast.error(`${err.message}`)
    }
  }

  useEffect(() => {
    fetchMyCompletedItinerary().catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    fetchMySharedItinerary().catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    fetchMyItinerary().catch((err) => console.log(err))
  }, [page])

  return (
    <div className="flex flex-col items-center gap-7 pt-28">
      <div className="flex flex-col items-center gap-7 px-5 w-full lg:w-4/5">
        <div className="flex flex-col justify-start gap-7 w-full">
          <h2 className="font-semibold text-2xl text-center md:text-left md:text-[36px] self-start">
            Rencana Perjalanan Saya
          </h2>
          <Link
            href={'/itinerary/create'}
            className="w-full md:w-1/3 mx-auto"
            replace={true}
          >
            <Button className="bg-gradient-to-r from-[#016CD7] to-[#014285] text-white items-center flex gap-3 w-full">
              <PlusIcon />
              Buat Itinerary Baru
            </Button>
          </Link>
          <MyItineraryList
            data={data}
            metadata={metadata}
            refresh={refreshAll}
          />
        </div>
        <div className="flex flex-col justify-start gap-7 w-full">
          <h2 className="font-semibold text-2xl text-center md:text-left md:text-[36px] self-start">
            Dibagikan
          </h2>
          <MyItineraryList
            data={sharedData}
            metadata={metadata}
            refresh={refreshAll}
          />
        </div>

        <div className="flex flex-col justify-start gap-7 w-full">
          <h2 className="font-semibold text-2xl md:text-left md:text-[36px] sel">
            Perjalanan Selesai
          </h2>
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
