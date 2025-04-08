import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/contexts/AuthContext'
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
    <div
      className="relative w-full h-40 md:h-64 rounded-md mb-4 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: data.coverImage
          ? `url(${data.coverImage})`
          : 'linear-gradient(360deg, #004080, #0073E6, #60A5FA)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 z-10 p-2 sm:p-4">
        <div className="flex flex-col">
          <h1 className="text-lg md:text-4xl font-bold text-white">
            {data.title}
          </h1>
          {data.description && (
            <p className="text-xs md:text-sm font-raleway text-white max-h-16 overflow-y-auto">
              <style jsx>{`
                p::-webkit-scrollbar {
                  width: 4px;
                }
                p::-webkit-scrollbar-track {
                  background: transparent;
                }
                p::-webkit-scrollbar-thumb {
                  background-color: rgba(255, 255, 255, 0.3);
                  border-radius: 20px;
                }
              `}</style>
              {data.description}
            </p>
          )}
        </div>
      </div>
      {user?.id === data.userId && (
        <Link
          href={contingencyId ? `${contingencyId}/edit` : `${data.id}/edit`}
        >
          <Button
            size="sm"
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-gradient-to-r from-[#0073E6] to-[#004080] text-white hover:from-[#0066cc] hover:to-[#003366]"
          >
            Edit
          </Button>
        </Link>
      )}
    </div>
  )
}
