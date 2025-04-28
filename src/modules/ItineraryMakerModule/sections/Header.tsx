import React, { useRef, useEffect, useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserRoundPlus, Edit2, Settings, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type CloudinaryUploadWidgetResults } from 'next-cloudinary'
import { SettingsItineraryModal } from '../module-elements/settingsModal'
import { customFetch, customFetchBody } from '@/utils/newCustomFetch'
import { CreateItineraryResponse } from '../interface'

interface ItineraryHeaderProps {
  itineraryId: string
  title: string
  description?: string
  coverImage?: string
  onTitleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onDescChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  onCoverImageChange: (result: CloudinaryUploadWidgetResults) => void
  isSubmitting: boolean
  isGenerating: boolean
  onGenerateFeedback: () => void
  isPublished: boolean
  isContingency: boolean
}

export const ItineraryHeader: React.FC<ItineraryHeaderProps> = ({
  itineraryId,
  title,
  description,
  coverImage,
  onTitleChange,
  onDescChange,
  onCoverImageChange,
  isPublished,
  isContingency,
}) => {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [localTitle, setLocalTitle] = useState(title)
  const [localDesc, setLocalDesc] = useState(description ?? '')
  const [localCoverImage, setLocalCoverImage] = useState(coverImage)
  const [visibility, setVisibility] = useState<'public' | 'private'>('private')

  // Handle title input focus to select all text if it's the default value
  const handleTitleFocus = () => {
    if (titleInputRef.current && title === 'Itinerary Tanpa Judul') {
      setTimeout(() => {
        titleInputRef.current?.select()
      }, 0)
    }
  }

  const handleSave = async (data: {
    title: string
    description?: string
    coverImage?: string
    isPublished: boolean
  }) => {
    setLocalTitle(data.title)
    setLocalDesc(data.description ?? '')
    setLocalCoverImage(data.coverImage)
    setVisibility(data.isPublished ? 'public' : 'private')

    onTitleChange({
      target: { value: data.title },
    } as React.ChangeEvent<HTMLInputElement>)
    onDescChange({
      target: { value: data.description ?? '' },
    } as React.ChangeEvent<HTMLInputElement>)
    if (data.coverImage) {
      onCoverImageChange({
        info: { secure_url: data.coverImage },
      } as CloudinaryUploadWidgetResults)
    }

    try {
      await customFetch<CreateItineraryResponse>(
        `/itineraries/${itineraryId}/publish`,
        {
          method: 'PATCH',
          body: customFetchBody({ isPublished: data.isPublished }),
          credentials: 'include',
        }
      )
    } catch (error) {
      console.error('Failed to publish itinerary:', error)
    }
  }

  return (
    <div
      className="relative w-full h-40 lg:h-64 rounded-md mb-4 flex items-center justify-center overflow-hidden"
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
              className="p-0 text-lg md:text-lg lg:text-4xl font-bold text-white bg-transparent border-none h-fit 
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
              className="p-0 text-xs md:text-xs lg:text-sm font-raleway text-white bg-transparent border-none h-fit 
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

      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex gap-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={cn(
            'bg-white text-black rounded-xl shadow',
            isContingency && 'opacity-50 cursor-not-allowed pointer-events-none'
          )}
          onClick={() => setIsSettingsModalOpen(true)}
          disabled={isContingency}
        >
          <Settings className="w-6 h-6 text-[#004080]" />
        </Button>
      </div>

      <SettingsItineraryModal
        isPublished={isPublished}
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSave}
        onTitleChange={onTitleChange}
        onDescChange={onDescChange}
        onCoverImageChange={onCoverImageChange}
        isContingency={isContingency}
        title={title}
        description={description}
        coverImage={coverImage}
      />
    </div>
  )
}
