import { getImage } from '@/utils/getImage'
import { EllipsisIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import type { ItineraryData } from './types'
import useOutsideClick from '@/hooks/useOutsideClick'
import { customFetch } from '@/utils/customFetch'
import { toast } from 'sonner'

function ItineraryCard({
  item,
  refresh,
}: {
  readonly item: Readonly<ItineraryData>
  readonly refresh: () => void
}) {
  const [openOptions, setOpenOptions] = useState(false)
  const optionRef = useRef<HTMLDivElement>(null)
  const daysTotal = Math.floor(
    (new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  )

  useOutsideClick({
    ref: optionRef,
    handler: () => setOpenOptions(false),
  })

  const markAsComplete = async () => {
    try {
      const response = await customFetch(
        `/itineraries/${item.id}/mark-as-complete`,
        {
          method: 'PATCH',
        }
      )

      if (response.statusCode !== 200) throw new Error(response.message)
      toast.success('Itinerary marked as complete!')
      refresh()
    } catch (err) {
      if (err instanceof Error) toast.error(`${err.message}`)
    }
  }

  return (
    <div className="group flex items-center gap-5 shadow-lg w-full rounded-xl overflow-hidden hover:cursor-pointer relative">
      <div className="w-1/4 h-full overflow-hidden">
        <Image
          src={getImage(item.coverImage ?? 'logo-no-background.png')}
          alt={item.title}
          width={720}
          height={720}
          className="w-full h-full object-cover pointer-events-none group-hover:scale-125 duration-300"
        />
      </div>
      <div className="w-3/4 h-full flex flex-col gap-2 py-4">
        <p className="font-raleway font-medium text-sm md:text-xl w-4/5">
          {item.title}
        </p>
        <div className="font-raleway text-[#94A3B8] flex flex-col gap-1">
          {/* <div className="flex gap-2 items-center">
            <MapPinIcon size={16} />
            <p className="text-base">Bali</p>
          </div> */}
          <p className="text-xs md:text-sm">
            {daysTotal} Hari • {item.locationCount} Destinasi
          </p>
        </div>
      </div>
      <button
        data-testid="option-btn"
        className="absolute top-2 right-2 p-2 rounded-full hover:bg-black/10"
        onClick={() => setOpenOptions(!openOptions)}
      >
        <EllipsisIcon />
      </button>

      {openOptions && (
        <div
          ref={optionRef}
          className="absolute top-2 right-2 z-20 bg-white shadow-lg text-sm font-medium rounded-lg overflow-hidden w-max flex flex-col"
        >
          {!item.isCompleted && (
            <button
              onClick={markAsComplete}
              className="hover:bg-black/10 px-4 py-2"
            >
              Mark as Completed
            </button>
          )}
          <button className="hover:bg-black/10 px-4 py-2 text-red-500">
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default ItineraryCard
