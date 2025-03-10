import { cn } from '@/lib/utils'
import { Clock, MapPin, Tag } from 'lucide-react'

export const ItineraryDay = ({ section }: { section: Section }) => {
  return (
    <div className="relative p-4 bg-white mb-2">
      <div className="absolute -left-1 top-5 bottom-8 w-0.5 bg-[#94A3B8]"></div>

      <div className="absolute -left-5 top-5 bg-[#0073E6] text-white font-bold w-8 h-12 flex items-center justify-center">
        {section.sectionNumber}
      </div>

      <h2 className="text-3xl mt-3 font-raleway font-bold ml-2">
        {section.title}
      </h2>

      {section.blocks.map((block, index) => {
        const isLastBlock = index === section.blocks.length - 1
        const formatTime = (time: string) =>
          new Date(time).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })

        return (
          <div
            key={block.id}
            className={cn(
              'p-3',
              block.blockType === 'NOTE' ? 'bg-[#E5F1FF]' : 'bg-white'
            )}
          >
            {block.blockType === 'LOCATION' && (
              <>
                <h3 className="text-3xl font-bold font-raleway">
                  {block.title}
                </h3>
                <div className="flex items-center gap-4 text-lg text-[#024C98] font-roboto font-medium">
                  <div className="flex items-center gap-1">
                    <Clock size={16} /> {formatTime(block.startTime)} -{' '}
                    {formatTime(block.endTime)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag size={16} /> Rp{block.price.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} /> {block.location}
                  </div>
                </div>
                <p className="text-lg font-roboto">{block.description}</p>
              </>
            )}

            {block.blockType === 'NOTE' && (
              <p className="text-lg font-roboto">{block.description}</p>
            )}

            {isLastBlock && (
              <div className="absolute -left-1 bottom-8 w-4 border-t-2 border-[#94A3B8]"></div>
            )}
          </div>
        )
      })}
    </div>
  )
}
