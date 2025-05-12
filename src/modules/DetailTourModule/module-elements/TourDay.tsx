import { cn } from '@/lib/utils'
import { Clock, MapPin } from 'lucide-react'

export const TourDay = ({ section }: { section: Section }) => {
  return (
    <div className="relative p-4 bg-white -mb-8">
      <div className="absolute -left-1 top-5 bottom-8 w-0.5 bg-[#94A3B8]"></div>
      <div
        className={`absolute -left-5 top-5 bg-[#024C98] text-white font-bold w-8 h-12 flex items-center justify-center`}
      >
        {section.sectionNumber === 1 ? (
          <MapPin className="w-5 h-5" />
        ) : (
          section.sectionNumber
        )}
      </div>
      <h2 className="md:text-lg text-raleway mt-3 font-semibold ml-2">
        {section.title}
      </h2>
      {section.blocks.map((block, index) => {
        const isLastBlock = index === section.blocks.length - 1
        const formatTime = (time: string) =>
          time
            ? new Date(time).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })
            : null
        return (
          <div key={block.id}>
            <div
              className={cn(
                'p-3 w-full',
                block.blockType === 'NOTE' ? 'bg-[#E5F1FF]' : 'bg-white'
              )}
            >
              {block.blockType === 'LOCATION' && (
                <>
                  <h3 className="md:text-lg font-bold font-raleway">
                    {block.title}
                  </h3>
                  <div className="flex items-center gap-4 md:text-sm text-[#024C98] font-roboto font-medium">
                    {block.startTime && block.endTime && (
                      <div className="flex items-center gap-1">
                        <Clock size={16} /> {formatTime(block.startTime)} -{' '}
                        {formatTime(block.endTime)}
                      </div>
                    )}
                  </div>
                  <p className="md:text-sm font-roboto">{block.description}</p>
                </>
              )}
              {block.blockType === 'NOTE' && (
                <p className="md:text-sm font-roboto">{block.description}</p>
              )}
              {isLastBlock && (
                <div className="absolute -left-1 bottom-8 w-4 border-t-2 border-[#94A3B8]"></div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
