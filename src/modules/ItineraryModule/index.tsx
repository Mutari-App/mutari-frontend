'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import MyItineraryList from './sections/MyItineraryList'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import Image from 'next/image'
import { getImage } from '@/utils/getImage'

export default function ItineraryModule() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = searchParams.get('page') ?? '1'

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
        <Link href={'/'} className="w-full md:w-1/3">
          <Button className="bg-gradient-to-r from-[#016CD7] to-[#014285] text-white items-center flex gap-3 w-full">
            <PlusIcon />
            Buat Itinerary Baru
          </Button>
        </Link>
        <MyItineraryList page={page} />
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
