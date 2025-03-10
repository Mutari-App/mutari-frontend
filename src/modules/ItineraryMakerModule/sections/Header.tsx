import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ItineraryHeaderProps {
  title: string
  coverImage?: string
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isSubmitting: boolean
  onSubmit: () => void
}

export const ItineraryHeader: React.FC<ItineraryHeaderProps> = ({
  title,
  coverImage,
  onTitleChange,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <div
      className="relative w-full h-64 rounded-md mb-4 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: coverImage
          ? `url(${coverImage})`
          : 'linear-gradient(360deg, #004080, #0073E6, #60A5FA)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 flex p-4 z-10">
        <Input
          className="md:text-4xl font-bold text-white bg-transparent border-none h-fit focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={title}
          onChange={onTitleChange}
          placeholder="Enter trip title"
        />
      </div>
      <Button
        className="absolute top-4 right-4 z-10 bg-gradient-to-r from-[#0073E6] to-[#004080] text-white hover:from-[#0066cc] hover:to-[#003366]"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
      </Button>
    </div>
  )
}
