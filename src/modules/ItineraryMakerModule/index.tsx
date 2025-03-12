'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import {
  type CreateItineraryDto,
  type Section,
  type Block,
  type CreateItineraryResponse,
  type Tag,
} from './interface'
import { customFetch, customFetchBody } from '@/utils/customFetch'
import { type DropResult } from '@hello-pangea/dnd'
import { type DateRange } from 'react-day-picker'
import { v4 } from 'uuid'
import { ItineraryHeader } from './sections/Header'
import { ItinerarySections } from './sections/ItinerarySections'
import { DateRangeAlertDialog } from './module-elements/DateRangeAlertDialog'
import { TagSelector } from './module-elements/TagSelector'
import { CldUploadButton } from 'next-cloudinary'
import { cn } from '@/lib/utils'
import { useAuthContext } from '@/contexts/AuthContext'
import { redirect, useParams, useRouter } from 'next/navigation'
import NotFound from 'next/error'

const SAVED_ITINERARY_KEY = 'saved_itinerary_data'

export default function ItineraryMakerModule() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeWarning, setTimeWarning] = useState<{
    blockId: string
    message: string
  } | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const pendingDateRange = useRef<DateRange | undefined>(undefined)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const { isAuthenticated } = useAuthContext()
  const router = useRouter()
  const { id: itineraryId } = useParams<{ id: string }>()
  const [data, setData] = useState<Itinerary>({} as Itinerary)

  const initialItineraryData = useRef<CreateItineraryDto>({
    title: 'Itinerary Tanpa Judul',
    description: '',
    coverImage: '',
    startDate: '',
    endDate: '',
    tags: [],
    sections: [
      {
        sectionNumber: 1,
        title: 'Hari ke-1',
        blocks: [
          {
            id: v4(),
            blockType: 'LOCATION',
            title: 'Masukkan Judul',
          },
        ],
      },
    ],
  })

  const [visibleInputs, setVisibleInputs] = useState<
    Record<
      string,
      {
        time?: boolean
        price?: boolean
        location?: boolean
      }
    >
  >({})

  const [itineraryData, setItineraryData] = useState<CreateItineraryDto>(
    initialItineraryData.current
  )

  // Fetch detail if id is provided
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await customFetch<ItineraryDetailResponse>(
          `/itineraries/${itineraryId}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        if (res.statusCode !== 200) throw new Error(res.message)
        setData(res.data)
      } catch (err: any) {
        return <NotFound statusCode={404} />
      }
    }
    void fetchData()
  }, [])

  // Map existing data if fetched
  useEffect(() => {
    if (itineraryId) {
      // Section and Block mapping
      const mappedSections: Section[] = data.sections
        ? data.sections.map((section) => ({
            sectionNumber: section.sectionNumber,
            title: section.title,
            blocks: section.blocks.map((block) => ({
              id: block.id,
              blockType: block.blockType,
              title: block.title,
              description: block.description,
              startTime: block.startTime,
              endTime: block.endTime,
              location: block.location,
              price: block.price,
            })),
          }))
        : []
      // Tags mapping
      const mappedTags: string[] = data.tags
        ? data.tags.map((tag) => tag.tag.id)
        : []
      // Apply date
      if (data.startDate && data.endDate) {
        setDateRange({
          from: new Date(data.startDate),
          to: new Date(data.endDate),
        })
      }
      setItineraryData({
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        startDate: data.startDate,
        endDate: data.endDate,
        tags: mappedTags,
        sections: mappedSections,
      } as CreateItineraryDto)
    }
  }, [data])

  // Load saved itinerary data from local storage
  useEffect(() => {
    try {
      const savedItineraryJSON = localStorage.getItem(SAVED_ITINERARY_KEY)

      if (savedItineraryJSON) {
        const savedItinerary = JSON.parse(
          savedItineraryJSON
        ) as CreateItineraryDto

        setItineraryData(savedItinerary)

        if (savedItinerary.startDate && savedItinerary.endDate) {
          setDateRange({
            from: new Date(savedItinerary.startDate),
            to: new Date(savedItinerary.endDate),
          })
        }

        toast.success('Itinerary yang tersimpan berhasil dimuat')
        setHasUnsavedChanges(false)
        localStorage.removeItem(SAVED_ITINERARY_KEY)
      }
    } catch (error) {
      console.error('Error loading saved itinerary:', error)
      toast.error('Gagal memuat itinerary yang tersimpan')
      localStorage.removeItem(SAVED_ITINERARY_KEY)
    }
  }, [])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await customFetch<{ tags: Tag[] }>(
          '/itineraries/tags',
          {
            method: 'GET',
          }
        )

        if (response.success && response.tags) {
          setAvailableTags(response.tags)
        } else {
          toast.error('Gagal mengambil tag')
        }
      } catch (error) {
        console.error('Error fetching tags:', error)
        toast.error('Gagal mengambil tag')
      }
    }

    void fetchTags()
  }, [])

  useEffect(() => {
    // Check for unsaved changes by comparing current data with initial data
    const checkUnsavedChanges = () => {
      // Check if there are any blocks with modified data
      const hasModifiedBlocks = itineraryData.sections.some((section) => {
        return section.blocks?.some((block) => {
          return (
            block.title !== 'Masukkan Judul' ||
            (block.description ??
              block.startTime ??
              block.endTime ??
              block.location ??
              block.price !== undefined)
          )
        })
      })
      const hasBlocks = itineraryData.sections.some(
        (section) => section.blocks && section.blocks.length > 1
      )
      const hasCustomTitle =
        itineraryData.title !== initialItineraryData.current.title
      const hasDates =
        itineraryData.startDate !== '' || itineraryData.endDate !== ''
      const hasTags = (itineraryData.tags?.length ?? 0) > 0
      const hasCoverImage = itineraryData.coverImage !== ''

      setHasUnsavedChanges(
        hasBlocks ||
          hasCustomTitle ||
          hasDates ||
          hasTags ||
          hasCoverImage ||
          hasModifiedBlocks
      )
    }

    checkUnsavedChanges()
  }, [itineraryData])

  useEffect(() => {
    // Attach beforeunload event handler to detect tab closing or navigation away
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  const handleImageUpload = (result: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (result?.info?.secure_url) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const imageUrl = result.info.secure_url

      setItineraryData((prev) => ({
        ...prev,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        coverImage: imageUrl,
      }))

      toast.success('Cover image uploaded successfully')
    } else {
      toast.error('Failed to upload image')
    }
  }

  const handleTagsChange = (tags: string[]) => {
    setItineraryData((prev) => ({
      ...prev,
      tags,
    }))
  }

  const removeTag = (tagId: string) => {
    setItineraryData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((id) => id !== tagId) ?? [],
    }))
  }

  const getSelectedTagNames = () => {
    return (itineraryData.tags ?? [])
      .map((tagId) => {
        const tag = availableTags.find((t) => t.id === tagId)
        return tag ? tag.name : ''
      })
      .filter(Boolean)
  }

  type InputType = 'time' | 'price' | 'location'

  const toggleInput = (blockId: string, inputType: InputType) => {
    const isCurrentlyVisible = visibleInputs[blockId]?.[inputType] ?? false
    if (isCurrentlyVisible) {
      updateBlockInputData(blockId, inputType)
    }
    updateInputVisibility(blockId, inputType)
    if (inputType === 'time') {
      setTimeWarning(null)
    }
  }

  const updateInputVisibility = (blockId: string, inputType: InputType) => {
    setVisibleInputs((prev) => {
      const currentValues = prev[blockId] || {}
      return {
        ...prev,
        [blockId]: {
          ...currentValues,
          [inputType]: !currentValues[inputType],
        },
      }
    })
  }

  const updateBlockInputData = (blockId: string, inputType: InputType) => {
    setItineraryData((prev) => {
      const updatedSections = clearBlockInputInSections(
        prev.sections,
        blockId,
        inputType
      )
      return {
        ...prev,
        sections: updatedSections,
      }
    })
  }

  const clearBlockInputInSections = (
    sections: Section[],
    blockId: string,
    inputType: InputType
  ) => {
    return sections.map((section) => {
      if (!section.blocks) return section

      const blockIndex = section.blocks.findIndex(
        (block) => block.id === blockId
      )
      if (blockIndex === -1) return section

      const updatedBlocks = [...section.blocks]
      const blockToUpdate = { ...updatedBlocks[blockIndex] }

      if (inputType === 'time') {
        blockToUpdate.startTime = undefined
        blockToUpdate.endTime = undefined
      } else if (inputType === 'price') {
        blockToUpdate.price = undefined
      } else if (inputType === 'location') {
        blockToUpdate.location = undefined
      }

      updatedBlocks[blockIndex] = blockToUpdate
      return {
        ...section,
        blocks: updatedBlocks,
      }
    })
  }

  const isInputVisible = (blockId: string, inputType: InputType) => {
    return visibleInputs[blockId]?.[inputType] ?? false
  }

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  // Check if there are non-empty blocks that would be removed
  const checkForNonEmptyBlocks = (
    currentSections: Section[],
    newSectionCount: number
  ) => {
    const sectionsToRemove = currentSections.filter(
      (section) => section.sectionNumber > newSectionCount
    )

    return sectionsToRemove.some(
      (section) => section.blocks && section.blocks.length > 0
    )
  }

  // Function to apply date range changes after confirmation if needed
  const applyDateRangeChange = (range: DateRange | undefined) => {
    if (!range) {
      // When clearing the date selection, just clear the dates but preserve sections
      setDateRange({ from: undefined, to: undefined })
      setItineraryData((prev) => ({
        ...prev,
        startDate: '',
        endDate: '',
      }))
      return
    }

    const { from, to } = range

    setDateRange({ from, to })

    if (from && to) {
      setItineraryData((prev) => ({
        ...prev,
        startDate: from.toISOString(),
        endDate: to.toISOString(),
      }))

      const diffTime = Math.abs(to.getTime() - from.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

      const newSections: Section[] = []
      for (let i = 1; i <= diffDays; i++) {
        const existingSection = itineraryData.sections.find(
          (s) => s.sectionNumber === i
        )
        if (existingSection) {
          newSections.push(existingSection)
        } else {
          newSections.push({
            sectionNumber: i,
            title: `Hari ke-${i}`,
            blocks: [],
          })
        }
      }

      setItineraryData((prev) => ({
        ...prev,
        sections: newSections,
      }))
    }
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range?.from || !range.to) {
      applyDateRangeChange(range)
      return
    }

    const diffTime = Math.abs(range.to.getTime() - range.from.getTime())
    const newDayCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    if (
      newDayCount < itineraryData.sections.length &&
      checkForNonEmptyBlocks(itineraryData.sections, newDayCount)
    ) {
      pendingDateRange.current = range
      setShowConfirmDialog(true)
    } else {
      applyDateRangeChange(range)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItineraryData((prev) => ({
      ...prev,
      title: e.target.value,
    }))
  }

  const addBlock = (sectionNumber: number, blockType: string) => {
    setItineraryData((prev) => {
      const updatedSections = prev.sections.map((section) => {
        if (section.sectionNumber === sectionNumber) {
          const newBlock = {
            id: v4(),
            blockType,
            title: blockType === 'LOCATION' ? 'Masukkan Lokasi' : '',
            description: '',
          }
          return {
            ...section,
            blocks: [...(section.blocks ?? []), newBlock],
          }
        }
        return section
      })
      return {
        ...prev,
        sections: updatedSections,
      }
    })
  }

  const addSection = (position?: 'after' | 'before', relativeTo?: number) => {
    const newSectionNumber = itineraryData.sections.length + 1

    setItineraryData((prev) => {
      let newSections = [...prev.sections]
      const newSection = {
        sectionNumber: newSectionNumber,
        title: `Hari ke-${newSectionNumber}`,
        blocks: [],
      }

      // If adding at a specific position
      if (position && relativeTo !== undefined) {
        const insertIndex =
          position === 'after'
            ? newSections.findIndex((s) => s.sectionNumber === relativeTo) + 1
            : newSections.findIndex((s) => s.sectionNumber === relativeTo)

        newSections.splice(insertIndex, 0, newSection)

        // Renumber sections
        newSections = newSections.map((section, index) => ({
          ...section,
          sectionNumber: index + 1,
          title: section.title?.startsWith('Hari ke-')
            ? `Hari ke-${index + 1}`
            : section.title,
        }))
      } else {
        // Just add to the end
        newSections.push(newSection)
      }

      return {
        ...prev,
        sections: newSections,
      }
    })
  }

  const removeSection = (sectionNumber: number) => {
    setItineraryData((prev) => {
      if (prev.sections.length <= 1) {
        toast.error('Minimal harus ada satu bagian')
        return prev
      }

      let newSections = prev.sections.filter(
        (section) => section.sectionNumber !== sectionNumber
      )

      newSections = newSections.map((section, index) => ({
        ...section,
        sectionNumber: index + 1,
        title: section.title?.startsWith('Hari ke-')
          ? `Hari ke-${index + 1}`
          : section.title,
      }))

      return {
        ...prev,
        sections: newSections,
      }
    })
  }

  const moveSection = (sectionNumber: number, direction: 'up' | 'down') => {
    setItineraryData((prev) => {
      const sectionIndex = prev.sections.findIndex(
        (section) => section.sectionNumber === sectionNumber
      )

      if (
        (direction === 'up' && sectionIndex === 0) ||
        (direction === 'down' && sectionIndex === prev.sections.length - 1)
      ) {
        return prev
      }

      const newSections = [...prev.sections]
      const targetIndex =
        direction === 'up' ? sectionIndex - 1 : sectionIndex + 1

      // Swap sections
      ;[newSections[sectionIndex], newSections[targetIndex]] = [
        newSections[targetIndex],
        newSections[sectionIndex],
      ]

      // Renumber sections
      const renumberedSections = newSections.map((section, index) => ({
        ...section,
        sectionNumber: index + 1,
        title: section.title?.startsWith('Hari ke-')
          ? `Hari ke-${index + 1}`
          : section.title,
      }))

      return {
        ...prev,
        sections: renumberedSections,
      }
    })
  }

  // Validate time selection (end time should be after start time)
  const validateTimeSelection = (
    blockId: string,
    startTime: string | null,
    endTime: string | null
  ) => {
    if (startTime && endTime) {
      const start = new Date(startTime)
      const end = new Date(endTime)

      if (end <= start) {
        setTimeWarning({
          blockId,
          message: 'Waktu akhir harus setelah waktu awal',
        })
        return false
      }
    }

    setTimeWarning(null)
    return true
  }

  const updateBlock = <T extends keyof Block>(
    blockId: string,
    field: T,
    value: Block[T]
  ) => {
    setItineraryData((prev) => {
      const updatedSections = prev.sections.map((section) =>
        getUpdatedSectionWithBlock(section, blockId, field, value)
      )
      return {
        ...prev,
        sections: updatedSections,
      }
    })
  }

  const getUpdatedSectionWithBlock = <T extends keyof Block>(
    section: Section,
    blockId: string,
    field: keyof Block,
    value: Block[T]
  ): Section => {
    if (!section.blocks) return section

    const blockIndex = section.blocks.findIndex((block) => block.id === blockId)
    if (blockIndex === -1) return section

    const updatedBlocks = [...section.blocks]
    const currentBlock = { ...updatedBlocks[blockIndex] }

    const updatedBlock = {
      ...currentBlock,
      [field]: value,
    }

    if (
      (field === 'startTime' || field === 'endTime') &&
      updatedBlock.startTime &&
      updatedBlock.endTime
    ) {
      validateTimeSelection(
        blockId,
        updatedBlock.startTime,
        updatedBlock.endTime
      )
    }

    updatedBlocks[blockIndex] = updatedBlock
    return {
      ...section,
      blocks: updatedBlocks,
    }
  }

  const removeBlock = (blockId: string) => {
    setItineraryData((prev) => ({
      ...prev,
      sections: filterBlockFromSections(prev.sections, blockId),
    }))
    if (timeWarning && timeWarning.blockId === blockId) {
      setTimeWarning(null)
    }
  }

  const filterBlockFromSections = (
    sections: Section[],
    blockId: string
  ): Section[] => {
    return sections.map((section) => {
      if (!section.blocks) return section

      const blockIndex = section.blocks.findIndex(
        (block) => block.id === blockId
      )

      if (blockIndex === -1) return section

      const updatedBlocks = [...section.blocks]
      updatedBlocks.splice(blockIndex, 1)

      return {
        ...section,
        blocks: updatedBlocks,
      }
    })
  }

  const updateSectionTitle = (sectionNumber: number, title: string) => {
    setItineraryData((prev) => {
      const updatedSections = prev.sections.map((section) => {
        if (section.sectionNumber === sectionNumber) {
          return {
            ...section,
            title,
          }
        }
        return section
      })

      return {
        ...prev,
        sections: updatedSections,
      }
    })
  }

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) {
      return
    }

    const sourceSection = parseInt(source.droppableId.replace('section-', ''))
    const destinationSection = parseInt(
      destination.droppableId.replace('section-', '')
    )

    const sourceSectionObj = itineraryData.sections.find(
      (s) => s.sectionNumber === sourceSection
    )
    const destSectionObj = itineraryData.sections.find(
      (s) => s.sectionNumber === destinationSection
    )

    if (!sourceSectionObj?.blocks || !destSectionObj?.blocks) {
      return
    }

    // Handle block reordering within the same section
    if (
      sourceSection === destinationSection &&
      source.index !== destination.index
    ) {
      setItineraryData((prev) => {
        const updatedSections = prev.sections.map((section) => {
          if (section.sectionNumber === sourceSection && section.blocks) {
            const updatedBlocks = [...section.blocks]
            const [removed] = updatedBlocks.splice(source.index, 1)
            updatedBlocks.splice(destination.index, 0, removed)
            return {
              ...section,
              blocks: updatedBlocks,
            }
          }
          return section
        })

        return {
          ...prev,
          sections: updatedSections,
        }
      })
    }
    // Handle moving blocks between sections
    else if (sourceSection !== destinationSection) {
      setItineraryData((prev) => {
        // Find the relevant sections
        const sourceSectionObj = prev.sections.find(
          (s) => s.sectionNumber === sourceSection
        )
        const destSectionObj = prev.sections.find(
          (s) => s.sectionNumber === destinationSection
        )

        if (!sourceSectionObj?.blocks || !destSectionObj?.blocks) {
          return prev
        }

        const blockToMove = { ...sourceSectionObj.blocks[source.index] }

        // Create new sections array with the moved block
        const updatedSections = prev.sections.map((section) => {
          // Remove from source section
          if (section.sectionNumber === sourceSection) {
            const updatedBlocks = [...section.blocks!]
            updatedBlocks.splice(source.index, 1)
            return {
              ...section,
              blocks: updatedBlocks,
            }
          }

          // Add to destination section
          if (section.sectionNumber === destinationSection) {
            const updatedBlocks = [...section.blocks!]
            updatedBlocks.splice(destination.index, 0, blockToMove)
            return {
              ...section,
              blocks: updatedBlocks,
            }
          }

          return section
        })

        return {
          ...prev,
          sections: updatedSections,
        }
      })
    }
  }

  const handleSubmit = async () => {
    if (timeWarning) {
      toast.error(
        'Ada kesalahan pada pengaturan waktu. Silakan periksa kembali.'
      )
      return
    }

    if (!itineraryData.startDate || !itineraryData.endDate) {
      toast.error('Silakan masukkan tanggal perjalanan')
      return
    }

    // If user is not authenticated, save to local storage and redirect to login
    if (!isAuthenticated) {
      localStorage.setItem(SAVED_ITINERARY_KEY, JSON.stringify(itineraryData))
      setHasUnsavedChanges(false)
      toast.info('Silakan login untuk menyimpan itinerary Anda')
      redirect('/login?redirect=/itinerary/create')
    }

    // If user is authenticated, proceed with normal submission
    setIsSubmitting(true)
    try {
      // Remove block IDs before submitting
      const submissionData = {
        ...itineraryData,
        sections: itineraryData.sections.map((section) => ({
          ...section,
          blocks:
            section.blocks?.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ id, ...blockWithoutId }) => blockWithoutId
            ) ?? [],
        })),
      }

      const response = itineraryId
        ? await customFetch<CreateItineraryResponse>(
            `/itineraries/${itineraryId}`,
            {
              method: 'PATCH',
              body: customFetchBody(submissionData),
              credentials: 'include',
            }
          )
        : await customFetch<CreateItineraryResponse>('/itineraries', {
            method: 'POST',
            body: customFetchBody(submissionData),
            credentials: 'include',
          })

      if (!response.success) {
        throw new Error('Failed to create or edit itinerary')
      }

      setHasUnsavedChanges(false)
      toast(`Itinerary ${itineraryId ? 'updated' : 'created'} successfully`)

      router.push(`/itinerary/${response.id}`)
    } catch (error) {
      console.error('Error creating or updating itinerary:', error)
      toast.error(
        `Failed to ${itineraryId ? 'updated' : 'created'} itinerary. Please try again.`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 min-h-screen">
      <ItineraryHeader
        title={itineraryData.title}
        coverImage={itineraryData.coverImage}
        onTitleChange={handleTitleChange}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
      <div className="flex flex-wrap max-sm:justify-center items-center gap-2 mb-4">
        <TagSelector
          selectedTags={itineraryData.tags ?? []}
          onChangeAction={handleTagsChange}
          availableTags={availableTags}
        />
        <CldUploadButton
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={handleImageUpload}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          options={{
            clientAllowedFormats: ['image'],
            maxFiles: 1,
            maxFileSize: 1024 * 256, // 256 KB
          }}
        >
          Ganti foto cover
        </CldUploadButton>
        <div className="sm:ml-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                {dateRange.from && dateRange.to
                  ? `${format(dateRange.from, 'dd MMM')} - ${format(dateRange.to, 'dd MMM')}`
                  : 'Masukkan Tanggal Perjalanan'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={handleDateRangeChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {itineraryData.tags && itineraryData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {getSelectedTagNames().map((tagName, index) => (
            <Badge
              key={`tag-${tagName}-${itineraryData.tags![index]}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tagName}
              <button
                onClick={() => removeTag(itineraryData.tags![index])}
                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <DateRangeAlertDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        pendingDateRange={pendingDateRange.current}
        currentSectionCount={itineraryData.sections.length}
        onCancel={() => {
          pendingDateRange.current = undefined
          setShowConfirmDialog(false)
        }}
        onConfirm={() => {
          if (pendingDateRange.current) {
            applyDateRangeChange(pendingDateRange.current)
            pendingDateRange.current = undefined
          }
          setShowConfirmDialog(false)
        }}
      />
      <ItinerarySections
        sections={itineraryData.sections}
        updateSectionTitle={updateSectionTitle}
        addSection={addSection}
        removeSection={removeSection}
        moveSection={moveSection}
        addBlock={addBlock}
        updateBlock={updateBlock}
        removeBlock={removeBlock}
        handleDragEnd={handleDragEnd}
        toggleInput={toggleInput}
        isInputVisible={isInputVisible}
        timeWarning={timeWarning}
      />
      <div className="flex justify-center my-8">
        <Button
          size="sm"
          className="-mt-4 w-[240px] bg-gradient-to-r from-[#0073E6] to-[#004080] text-white hover:from-[#0066cc] hover:to-[#003366] rounded-lg"
          onClick={() => addSection()}
        >
          <Plus className="h-4 w-4" /> Bagian
        </Button>
      </div>
    </div>
  )
}
