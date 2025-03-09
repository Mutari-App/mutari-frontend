import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ItineraryHeaderProps {
  title: string
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isSubmitting: boolean
  onSubmit: () => void
}

export const ItineraryHeader: React.FC<ItineraryHeaderProps> = ({
  title,
  onTitleChange,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <div className="relative w-full h-64 bg-gradient-to-b from-blue-900 to-blue-800 rounded-md mb-4 flex items-center justify-center">
      <div className="absolute bottom-0 left-0 flex">
        <Input
          className="md:text-5xl font-bold text-white bg-transparent border-none h-fit focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={title}
          onChange={onTitleChange}
          placeholder="Enter trip title"
        />
      </div>
      <Button
        className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
      </Button>
    </div>
  )
}
