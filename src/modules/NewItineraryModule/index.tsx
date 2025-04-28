'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusIcon, FilterIcon } from 'lucide-react'
import Image from 'next/image'
import { getImage } from '@/utils/getImage'
import { customFetch } from '@/utils/customFetch'

import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  type ItineraryData,
  type ItineraryResponse,
  type metadataType,
} from '../ItineraryModule/module-elements/types'
import MyItineraryList from './sections/MyItineraryList'
import ExploreItinerarySection from '../ItineraryModule/sections/ExploreItinerarySection'

interface FilterState {
  shared: boolean
  finished: boolean
}

export default function NewItineraryModule() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = searchParams.get('page') ?? 1

  // Parse filter parameters from URL
  const sharedParam = searchParams.get('shared') === 'true'
  const finishedParam = searchParams.get('finished') === 'true'

  const defaultMetadata = {
    page: 1,
    totalPages: 1,
    total: 0,
  }
  const [data, setData] = useState<ItineraryData[]>([])
  const [metadata, setMetadata] = useState<metadataType>(defaultMetadata)
  const [filters, setFilters] = useState<FilterState>({
    shared: sharedParam,
    finished: finishedParam,
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const refreshAll = async () => {
    await fetchAllMyItinerary()
  }

  const fetchAllMyItinerary = async () => {
    try {
      let url = `/itineraries/me/all?page=${page}`

      // Add filter parameters to the API call
      if (filters.shared) {
        url += '&shared=true'
      }

      if (filters.finished) {
        url += '&finished=true'
      }

      const res = await customFetch<ItineraryResponse>(url, {
        isAuthorized: true,
      })
      if (res.statusCode === 401) return

      if (res.statusCode !== 200) throw new Error(res.message)
      setData(res.itinerary.data)
      setMetadata(res.itinerary.metadata)
    } catch (err: any) {
      if (err instanceof Error) toast.error(`${err.message}`)
    }
  }

  const handleFilterChange = (filterType: keyof FilterState) => {
    // Toggle the selected filter
    const newFilters = {
      ...filters,
      [filterType]: !filters[filterType],
    }

    setFilters(newFilters)

    // Update URL with the new filters
    const params = new URLSearchParams(searchParams.toString())
    params.set('shared', newFilters.shared.toString())
    params.set('finished', newFilters.finished.toString())
    params.set('page', '1') // Reset to page 1 when changing filters
    router.push(`?${params.toString()}`)
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(Boolean).length
  }

  const activeFilterCount = getActiveFilterCount()

  useEffect(() => {
    fetchAllMyItinerary().catch((err) => console.log(err))
  }, [page, filters])

  return (
    <div className="flex flex-col items-center gap-7 pt-28">
      <div className="flex flex-col items-center gap-7 px-5 w-full lg:w-4/5">
        <div className="flex flex-col justify-start gap-7 w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="font-semibold text-2xl text-center md:text-left md:text-[36px]">
              Rencana Perjalanan Saya
            </h2>
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="relative flex items-center gap-2 border-[#016CD7] text-[#016CD7] hover:bg-[#016CD7]/10"
                >
                  <FilterIcon className="h-4 w-4" />
                  <span>Filter</span>
                  {activeFilterCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-[#016CD7]">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Itinerary</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="shared"
                        checked={filters.shared}
                        onCheckedChange={() => handleFilterChange('shared')}
                        className="data-[state=checked]:bg-[#016CD7] data-[state=checked]:border-[#016CD7]"
                      />
                      <Label htmlFor="shared" className="cursor-pointer">
                        Dibagikan
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="finished"
                        checked={filters.finished}
                        onCheckedChange={() => handleFilterChange('finished')}
                        className="data-[state=checked]:bg-[#016CD7] data-[state=checked]:border-[#016CD7]"
                      />
                      <Label htmlFor="finished" className="cursor-pointer">
                        Perjalanan Selesai
                      </Label>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFilters({ shared: false, finished: false })
                        const params = new URLSearchParams(
                          searchParams.toString()
                        )
                        params.set('shared', 'false')
                        params.set('finished', 'false')
                        params.set('page', '1')
                        router.push(`?${params.toString()}`)
                      }}
                      className="text-sm"
                    >
                      Reset
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsFilterOpen(false)}
                      className="bg-[#016CD7] hover:bg-[#014285] text-sm"
                    >
                      Terapkan
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

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
      </div>
      <div className="text-center text-sm">
        <p>
          <span className="font-bold text-[#016CD7]">LELAH</span> membuat
          rencana perjalanan dari nol?
        </p>
        <p>Coba jelajahi itinerary yang dibuat oleh pengguna!</p>
      </div>
      <Image
        src={getImage('section-break-bg.png') || '/placeholder.svg'}
        alt=""
        width={720}
        height={720}
        className="w-screen"
      />
      <ExploreItinerarySection />
    </div>
  )
}
