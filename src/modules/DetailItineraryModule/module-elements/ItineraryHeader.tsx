import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/contexts/AuthContext'
import { getImage } from '@/utils/getImage'
import Image from 'next/image'
import Link from 'next/link'

export const ItineraryHeader = ({
  data,
  contingencyId,
}: {
  data: Itinerary
  contingencyId?: string
}) => {
  const { user } = useAuthContext()

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
        {data.description && (
          <p className="text-md text-[#94A3B8] font-raleway">
            {data.description}
          </p>
        )}
      </div>
      {user?.id === data.userId && (
        <Link
          href={contingencyId ? `${contingencyId}/edit` : `${data.id}/edit`}
        >
          <Button className="absolute top-4 right-4 bg-gradient-to-r from-[#016CD7] to-[#014285] text-white px-4 py-2 rounded-md text-sm font-roboto">
            Edit
          </Button>
        </Link>
      )}
    </div>
  )
}
