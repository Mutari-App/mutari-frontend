import React, { useRef, useEffect } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Wand2, Edit2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  type CloudinaryUploadWidgetResults,
  CldUploadButton,
} from 'next-cloudinary'

interface ItineraryHeaderProps {
  title: string
  description?: string
  coverImage?: string
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDescChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onCoverImageChange: (result: CloudinaryUploadWidgetResults) => void
  isSubmitting: boolean
  isGenerating: boolean
  onGenerateFeedback: () => void
  isContingency: boolean
}

export const ItineraryHeader: React.FC<ItineraryHeaderProps> = ({
  title,
  description,
  coverImage,
  onTitleChange,
  onDescChange,
  onCoverImageChange,
  isGenerating,
  onGenerateFeedback,
  isContingency,
}) => {
  const titleInputRef = useRef<HTMLInputElement>(null)

  // Handle title input focus to select all text if it's the default value
  const handleTitleFocus = () => {
    if (titleInputRef.current && title === 'Itinerary Tanpa Judul') {
      setTimeout(() => {
        titleInputRef.current?.select()
      }, 0)
    }
  }

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
          <div className="relative group">
            <Input
              ref={titleInputRef}
              className="p-0 text-lg md:text-4xl font-bold text-white bg-transparent border-none h-fit 
                focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 
                disabled:opacity-100 disabled:text-white disabled:bg-transparent 
                placeholder:text-white/60"
              value={title}
              onChange={onTitleChange}
              onFocus={handleTitleFocus}
              placeholder="Masukkan Judul Perjalanan"
              disabled={isContingency}
              style={{ cursor: isContingency ? 'not-allowed' : 'text' }}
            />
            {!isContingency && (
              <Edit2
                size={16}
                className="text-white opacity-0 group-hover:opacity-60 absolute right-2 top-1/2 transform -translate-y-1/2"
              />
            )}
          </div>
          <div className="relative group mt-1">
            <Input
              className="p-0 text-xs md:text-sm font-raleway text-white bg-transparent border-none h-fit 
                focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 
                disabled:opacity-100 disabled:text-white disabled:bg-transparent 
                placeholder:text-white/60"
              value={description}
              onChange={onDescChange}
              placeholder="Masukkan Deskripsi Perjalanan"
              disabled={isContingency}
              style={{ cursor: isContingency ? 'not-allowed' : 'text' }}
            />
            {!isContingency && (
              <Edit2
                size={12}
                className="text-white opacity-0 group-hover:opacity-60 absolute right-2 top-1/2 transform -translate-y-1/2"
              />
            )}
          </div>
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
            {isGenerating ? 'Memproses...' : 'Buat Saran AI'}
          </span>
        </Button>
      )}
      <CldUploadButton
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={onCoverImageChange}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          isContingency && 'opacity-50 cursor-not-allowed pointer-events-none',
          'absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-white bg-[#1C1C1C99]'
        )}
        options={{
          clientAllowedFormats: ['image'],
          maxFiles: 1,
          maxFileSize: 1024 * 256, // 256 KB
        }}
      >
        Ganti foto cover
      </CldUploadButton>
    </div>
  )
}
