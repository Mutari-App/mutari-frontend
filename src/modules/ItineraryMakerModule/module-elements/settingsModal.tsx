import React, { useEffect, useState } from 'react'
import { X, Clipboard, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  type CloudinaryUploadWidgetResults,
  CldUploadButton,
} from 'next-cloudinary'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { customFetch } from '@/utils/newCustomFetch'
import { useRouter } from 'next/navigation'
import { getImage } from '@/utils/getImage'

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
  isEdit: boolean
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
  isEdit,
}) => {
  const [isClient, setIsClient] = React.useState(false)
  const [visibility, setVisibility] = React.useState<'public' | 'private'>(
    isPublished ? 'public' : 'private'
  )
  const [localTitle, setLocalTitle] = React.useState(title)
  const [localDesc, setLocalDesc] = React.useState(description)
  const [localCoverImage, setLocalCoverImage] = React.useState(coverImage)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setLocalTitle(title)
      setLocalDesc(description)
      setLocalCoverImage(coverImage)
      setVisibility(isPublished ? 'public' : 'private')
    }
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

  const handleDelete = async () => {
    try {
      const response = await customFetch(`/itineraries/${itineraryId}`, {
        method: 'DELETE',
      })
      if (response.success) {
        toast.success('Itinerary deleted successfully')
        router.push('/itinerary')
      } else {
        toast.error('Failed to delete itinerary')
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to delete itinerary')
    }
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white w-[600px] max-h-[80vh] rounded-2xl shadow-xl relative flex flex-col">
          {/* Fixed header with title and close button */}
          <div className="sticky top-0 z-10 bg-white p-6 py-4 rounded-t-2xl border-b flex items-center justify-between">
            <h2 className="text-xl font-bold">Itinerary Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-black hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable content area */}
          <div className="overflow-y-auto custom-scrollbar flex-1">
            <div
              className="relative w-full h-56 flex items-center justify-center overflow-hidden"
              style={{
                backgroundImage: coverImage
                  ? `url(${coverImage})`
                  : `url(${getImage('itinerary_placeholder.png')})`,
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
                  'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 text-white hover:text-white bg-[#1C1C1C99] p-2 rounded-full hover:bg-[#1C1C1Ce6] transition-colors'
                )}
                options={{
                  clientAllowedFormats: ['image'],
                  maxFiles: 1,
                  maxFileSize: 1024 * 1024, // 1 MB
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
                  <label className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={visibility === 'public'}
                      onChange={() => setVisibility('public')}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-medium">Public</span>
                      <br />
                      <span className="text-gray-500">
                        Itinerary akan masuk ke discovery catalogue mutari dan
                        dapat dilihat seluruh pengguna Mutari
                      </span>
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={visibility === 'private'}
                      onChange={() => setVisibility('private')}
                      className="mt-1"
                    />
                    <span>
                      <span className="font-medium">Private</span>
                      <br />
                      <span className="text-gray-500">
                        Itinerary hanya dapat dilihat olehmu dan orang-orang
                        yang kamu invite atau memiliki link sharing
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              <hr />

              {/* Only show duplicate and delete buttons in edit mode */}
              {isEdit && (
                <div className="text-sm">
                  <button
                    className="flex items-center gap-2 text-gray-700 font-medium hover:bg-gray-50 p-2 rounded-md w-full transition-colors"
                    onClick={handleDuplicate}
                  >
                    <Clipboard size={18} /> Duplikat itinerary
                  </button>
                  <button
                    className="flex items-center gap-2 text-red-600 font-medium hover:bg-red-50 p-2 rounded-md w-full transition-colors"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash size={18} /> Hapus itinerary
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Fixed footer with save button */}
          <div className="sticky bottom-0 z-10 bg-white p-6 py-4 border-t rounded-b-2xl">
            <Button
              onClick={handleSave}
              variant="gradient"
              className="w-full"
              disabled={isContingency}
            >
              Simpan
            </Button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white w-[400px] rounded-2xl shadow-xl p-6 animate-in fade-in duration-200">
            <h3 className="text-xl font-bold mb-4">Hapus Itinerary</h3>
            <p className="mb-6">
              Apakah anda yakin ingin menghapus itinerary ini? Tindakan ini
              tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
