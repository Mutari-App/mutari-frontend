import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ItineraryHeaderProps {
  title: string
  description?: string
  coverImage?: string
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDescChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isSubmitting: boolean
  isGenerating: boolean
  onGenerateFeedback: () => void
  onSubmit: () => void
  isContingency: boolean
}

export const ItineraryHeader: React.FC<ItineraryHeaderProps> = ({
  title,
  description,
  coverImage,
  onTitleChange,
  onDescChange,
  isSubmitting,
  isGenerating,
  onGenerateFeedback,
  onSubmit,
  isContingency,
}) => {
  return (
    <div
      className="relative w-full h-40 md:h-64 rounded-md mb-4 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: coverImage
          ? `url(${coverImage})`
          : 'linear-gradient(360deg, #004080, #0073E6, #60A5FA)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 z-10 p-2 sm:p-4 w-full">
        <div className="flex flex-col">
          <Input
            className="p-0 text-lg md:text-4xl font-bold text-white bg-transparent border-none h-fit focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-100 disabled:text-white disabled:bg-transparent placeholder:text-white/60"
            value={title}
            onChange={onTitleChange}
            placeholder="Enter trip title"
            disabled={isContingency}
          />
          <Input
            className="p-0 text-xs md:text-sm font-raleway text-white bg-transparent border-none h-fit focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-100 disabled:text-white disabled:bg-transparent placeholder:text-white/60"
            value={description}
            onChange={onDescChange}
            placeholder="Masukkan Deskripsi Perjalanan"
            disabled={isContingency}
          />
        </div>
      </div>

      {!isContingency && (
        <Button
          size="sm"
          className={cn(
            'group relative overflow-hidden rounded-md px-4 py-1 text-sm font-medium text-white',
            'absolute top-2 left-2 sm:top-4 sm:left-4 z-10',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-70 disabled:cursor-not-allowed'
          )}
          onClick={onGenerateFeedback}
          disabled={isGenerating}
        >
          {/* Base gradient layer */}
          <span className="absolute inset-0 bg-gradient-to-r from-[#0073E6] to-[#80004B] transition-opacity duration-300 ease-in-out" />

          {/* Hover gradient layer */}
          <span className="absolute inset-0 bg-gradient-to-r from-[#80004B] to-[#0073E6] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />

          <span className="relative flex items-center gap-1.5">
            <Wand2 size={16} />
            {isGenerating ? 'Memproses...' : 'AI Feedback'}
          </span>
        </Button>
      )}

      <Button
        size="sm"
        className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-gradient-to-r from-[#0073E6] to-[#004080] text-white hover:from-[#0066cc] hover:to-[#003366]"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
      </Button>
    </div>
  )
}
