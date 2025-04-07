import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Wand2 } from 'lucide-react'

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
      <div className="absolute bottom-0 left-0 z-10 p-2 md:p-4">
        <div className="flex flex-col">
          <Input
            className="text-lg md:text-4xl font-bold text-white bg-transparent border-none h-fit focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            value={title}
            onChange={onTitleChange}
            placeholder="Enter trip title"
          />
          <Input
            className="text-sm md:text-md font-raleway text-[#94A3B8] bg-transparent border-none h-fit focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            value={description}
            onChange={onDescChange}
            placeholder="Masukkan Deskripsi Perjalanan"
          />
        </div>
      </div>

      <Button
        size="sm"
        className="absolute top-4 left-4 z-10 bg-gradient-to-r from-[#0073E6] to-[#80004B] text-white hover:from-[#80004B] hover:to-[#0073E6]"
        onClick={onGenerateFeedback}
        disabled={isGenerating}
      >
        <Wand2 size={16} />
        {isGenerating ? 'Generating...' : 'Generate AI Feedback'}
      </Button>

      <Button
        size="sm"
        className="absolute top-4 right-4 z-10 bg-gradient-to-r from-[#0073E6] to-[#004080] text-white hover:from-[#0066cc] hover:to-[#003366]"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
      </Button>
    </div>
  )
}
