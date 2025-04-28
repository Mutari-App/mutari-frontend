import React, { useEffect } from 'react'
import { X, Clipboard, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  type CloudinaryUploadWidgetResults,
  CldUploadButton,
} from 'next-cloudinary'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface SettingsItineraryModalProps {
  isOpen: boolean
  coverImage?: string
  onClose: () => void
  onSave: (data: {
    title: string
    description?: string
    coverImage?: string
    isPublished: boolean
  }) => void
  onDuplicate: (data: { itineraryId: string }) => void
  onTitleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onDescChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onCoverImageChange: (result: CloudinaryUploadWidgetResults) => void
  isContingency: boolean
  itineraryId: string
  title: string
  description?: string
  isPublished: boolean
}

export const SettingsItineraryModal: React.FC<SettingsItineraryModalProps> = ({
  isOpen,
  coverImage,
  onClose,
  onSave,
  onDuplicate,
  onCoverImageChange,
  isContingency,
  itineraryId,
  title,
  description,
  isPublished,
}) => {
  const [isClient, setIsClient] = React.useState(false)
  const [visibility, setVisibility] = React.useState<'public' | 'private'>(
    'private'
  )
  const [localTitle, setLocalTitle] = React.useState(title)
  const [localDesc, setLocalDesc] = React.useState(description)
  const [localCoverImage, setLocalCoverImage] = React.useState(coverImage)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    setLocalTitle(title)
    setLocalDesc(description)
    setLocalCoverImage(coverImage)
    setVisibility(isPublished ? 'public' : 'private')
  }, [title, description, coverImage, isPublished, isOpen])

  if (!isClient || !isOpen) return null

  const handleSave = () => {
    onSave({
      title: localTitle,
      description: localDesc,
      coverImage: localCoverImage,
      isPublished: visibility === 'public',
    })
    onClose()
  }

  const handleDuplicate = () => {
    onDuplicate({
      itineraryId: itineraryId,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-[600px] max-h-[70vh] overflow-y-auto rounded-2xl shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black z-20"
        >
          <X size={20} />
        </button>

        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold">Itinerary Settings</h2>
        </div>

        <div
          className="relative w-full h-56 lg:h-56 rounded-md mb-4 flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: coverImage
              ? `url(${coverImage})`
              : 'linear-gradient(360deg, #004080, #0073E6, #60A5FA)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <CldUploadButton
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={onCoverImageChange}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              isContingency &&
                'opacity-50 cursor-not-allowed pointer-events-none',
              'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 text-white bg-[#1C1C1C99] p-2 rounded-full'
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

        <div className="p-6 space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700"
            >
              Judul
            </label>
            <Textarea
              id="title"
              className="w-full mt-2 p-3 text-md bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={localTitle}
              onChange={(e) => {
                setLocalTitle(e.target.value)
              }}
              placeholder="Masukkan Judul Perjalanan"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700"
            >
              Deskripsi
            </label>
            <Textarea
              id="description"
              className="w-full mt-2 p-3 text-md bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={localDesc}
              onChange={(e) => {
                setLocalDesc(e.target.value)
              }}
              placeholder="Masukkan Deskripsi Perjalanan"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Siapa yang bisa lihat
            </label>
            <div className="space-y-2 text-sm">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === 'public'}
                  onChange={() => setVisibility('public')}
                />
                <span>
                  <span className="font-medium">Public</span>
                  <br />
                  <span className="text-gray-500">
                    Itinerary akan masuk ke discovery catalogue mutari dan dapat
                    dilihat seluruh pengguna Mutari
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === 'private'}
                  onChange={() => setVisibility('private')}
                />
                <span>
                  <span className="font-medium">Private</span>
                  <br />
                  <span className="text-gray-500">
                    Itinerary hanya dapat dilihat olehmu dan orang-orang yang
                    kamu invite atau memiliki link sharing
                  </span>
                </span>
              </label>
            </div>
          </div>

          <hr />

          <div className="text-sm">
            <button
              className="flex items-center gap-2 text-gray-700 font-medium mb-4"
              onClick={handleDuplicate}
            >
              <Clipboard size={18} /> Duplikat itinerary
            </button>
            <button className="flex items-center gap-2 text-red-600 font-medium">
              <Trash size={18} /> Hapus itinerary
            </button>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-2 text-sm mt-4"
            disabled={isContingency}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}
