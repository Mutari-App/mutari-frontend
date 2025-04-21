'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import MyItineraryList from './sections/MyItineraryList'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import Image from 'next/image'
import { getImage } from '@/utils/getImage'
import { customFetch } from '@/utils/customFetch'
import type {
  ItineraryData,
  ItineraryResponse,
  metadataType,
  TrendingItinerariesResponse,
  TrendingItineraryData,
} from './module-elements/types'
import { toast } from 'sonner'
import TrendingItineraryList from './sections/TrendingItineraryList'

export default function ItineraryModule() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const myItineraryPage = searchParams.get('myItineraryPage') ?? 1
  const sharedItineraryPage = searchParams.get('sharedItineraryPage') ?? 1
  const completedItineraryPage = searchParams.get('completedItineraryPage') ?? 1

  const [myItineraryMetadata, setMyItineraryMetadata] = useState<metadataType>({
    page: parseInt(myItineraryPage as string),
    totalPages: 0,
    total: 0,
  })
  const [sharedItineraryMetadata, setSharedItineraryMetadata] =
    useState<metadataType>({
      page: parseInt(sharedItineraryPage as string),
      totalPages: 0,
      total: 0,
    })
  const [completedItineraryMetadata, setCompletedItineraryMetadata] =
    useState<metadataType>({
      page: parseInt(completedItineraryPage as string),
      totalPages: 0,
      total: 0,
    })

  const [data, setData] = useState<ItineraryData[]>([])
  const [sharedData, setSharedData] = useState<ItineraryData[]>([])
  const [completedData, setCompletedData] = useState<ItineraryData[]>([])
  const [trendingData, setTrendingData] = useState<TrendingItineraryData[]>([])

  const refreshAll = async () => {
    await fetchMyItinerary()
    await fetchMyCompletedItinerary()
    await fetchMySharedItinerary()
  }

  function handleSearchparams(query: string, value: string) {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(query, value)
    } else {
      params.delete(query)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const fetchMyItinerary = async () => {
    try {
      const res = await customFetch<ItineraryResponse>(
        `/itineraries/me?page=${myItineraryPage}`,
        { isAuthorized: true }
      )
      if (res.statusCode === 401) return
      if (res.statusCode === 400) {
        handleSearchparams(
          'myItineraryPage',
          (parseInt(`${myItineraryPage}`) - 1).toString()
        )
        return
      }

      if (res.statusCode !== 200) throw new Error(res.message)
      setData(res.itinerary.data)
      setMyItineraryMetadata(res.itinerary.metadata)
    } catch (err: any) {
      if (err instanceof Error) toast.error(`${err.message}`)
    }
  }

  const fetchMySharedItinerary = async () => {
    try {
      const res = await customFetch<ItineraryResponse>(
        `/itineraries/me/shared?page=${sharedItineraryPage}`,
        { isAuthorized: true }
      )
      if (res.statusCode === 401) return
      if (res.statusCode === 400) {
        handleSearchparams(
          'sharedItineraryPage',
          (parseInt(`${sharedItineraryPage}`) - 1).toString()
        )
        return
      }
      if (res.statusCode !== 200) throw new Error(res.message)
      setSharedData(res.itinerary.data)
      setSharedItineraryMetadata(res.itinerary.metadata)
    } catch (err: any) {
      if (err instanceof Error) toast.error(`${err.message}`)
    }
  }

  const fetchMyCompletedItinerary = async () => {
    try {
      const res = await customFetch<ItineraryResponse>(
        `/itineraries/me/completed?page=${completedItineraryPage}`,
        {
          isAuthorized: true,
        }
      )
      if (res.statusCode === 401) return
      if (res.statusCode === 400) {
        handleSearchparams(
          'completedItineraryPage',
          (parseInt(`${completedItineraryPage}`) - 1).toString()
        )
        return
      }
      if (res.statusCode !== 200) throw new Error(res.message)
      setCompletedData(res.itinerary.data)
      setCompletedItineraryMetadata(res.itinerary.metadata)
    } catch (err: any) {
      if (err instanceof Error) toast.error(`${err.message}`)
    }
  }

  const fetchTrendingItineraries = async () => {
    try {
      const res = await customFetch<TrendingItinerariesResponse>(
        `/itineraries/trending`
      )
      if (res.statusCode !== 200) throw new Error(res.message)
      setTrendingData(res.itineraries)
    } catch (err: any) {
      if (err instanceof Error) toast.error(`${err.message}`)
    }
  }

  useEffect(() => {
    fetchMyItinerary().catch((err) => console.log(err))
  }, [myItineraryPage])

  useEffect(() => {
    fetchMySharedItinerary().catch((err) => console.log(err))
  }, [sharedItineraryPage])

  useEffect(() => {
    fetchMyCompletedItinerary().catch((err) => console.log(err))
  }, [completedItineraryPage])

  useEffect(() => {
    fetchTrendingItineraries().catch((err) => console.log(err))
  }, [])

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
            metadata={myItineraryMetadata}
            refresh={refreshAll}
            searchQueryParams="myItineraryPage"
          />
        </div>
        <div className="flex flex-col justify-start gap-7 w-full">
          <h2 className="font-semibold text-2xl text-center md:text-left md:text-[36px] self-start">
            Dibagikan
          </h2>
          <MyItineraryList
            data={sharedData}
            metadata={sharedItineraryMetadata}
            refresh={refreshAll}
            searchQueryParams="sharedItineraryPage"
          />
        </div>

        <div className="flex flex-col justify-start gap-7 w-full">
          <h2 className="font-semibold text-2xl md:text-left md:text-[36px] sel">
            Perjalanan Selesai
          </h2>
          <MyItineraryList
            data={completedData}
            metadata={completedItineraryMetadata}
            refresh={refreshAll}
            searchQueryParams="completedItineraryPage"
          />
        </div>

        <div className="flex flex-col justify-start gap-7 w-full">
          <h2 className="font-semibold text-2xl md:text-left md:text-[36px] sel">
            Eksplorasi
          </h2>
          <TrendingItineraryList data={trendingData} />
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
