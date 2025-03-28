import { getImage } from '@/utils/getImage'
import Image from 'next/image'
import Link from 'next/link'

export const ItineraryHeader = ({ data }: { data: Itinerary }) => {
  return (
    <div className="relative w-full h-40 md:h-64 rounded-lg overflow-hidden">
      <Image
        src={data.coverImage || getImage('default_cover.jpg')}
        alt={data.title || 'Default'}
        layout="fill"
        objectFit="cover"
        className="brightness-50"
      />
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <h1 className="md:text-4xl font-bold">{data.title}</h1>
        {data.description && <p className="text-lg">{data.description}</p>}
      </div>
      <Link href={`${data.id}/edit`} className="w-full md:w-1/3">
        <button className="absolute top-4 right-4 bg-gradient-to-r from-[#016CD7] to-[#014285] text-white px-4 py-2 rounded-md text-sm font-roboto">
          Edit
        </button>
      </Link>
    </div>
  )
}
