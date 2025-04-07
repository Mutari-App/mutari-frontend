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
  FeedbackItem,
  type Route,
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
import { Lightbulb } from 'lucide-react'
import { calculateRoute, TransportMode } from '@/utils/maps'
import Maps from './sections/Maps'

const SAVED_ITINERARY_KEY = 'saved_itinerary_data'

export default function ItineraryMakerModule() {
  const { user } = useAuthContext()
  const launchingDate = new Date(
    process.env.NEXT_PUBLIC_LAUNCHING_DATE || '2025-01-22T00:00:00'
  )
  const nowDate = new Date()
  const isLaunching = nowDate > launchingDate

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [dismissedFeedbacks, setDismissedFeedbacks] = useState<string[]>([])
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
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
  const [data, setData] = useState<Itinerary | null>(null)
  const wasAlreadyRequested = useRef(false)

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

  const itineraryDataRef = useRef(itineraryData)

  useEffect(() => {
    itineraryDataRef.current = itineraryData
  }, [itineraryData])

  // Fetch detail if id is provided
  useEffect(() => {
    const fetchData = async () => {
      try {
        wasAlreadyRequested.current = true
        const res = await customFetch<ItineraryDetailResponse>(
          `/itineraries/${itineraryId}`,
          {
            method: 'GET',
            credentials: 'include',
            isAuthorized: true,
          }
        )

        if (res.statusCode !== 200) throw new Error(res.message)
        if (res.data.userId !== user?.id) {
          toast.error('Anda tidak memiliki akses untuk mengedit itinerary ini')
          router.push(`/itinerary/${itineraryId}`)
          return
        }

        setData(res.data)
      } catch (err: any) {
        return <NotFound statusCode={404} />
      }
    }
    if (!wasAlreadyRequested.current) {
      void fetchData()
    }
  }, [itineraryId, router, user?.id, wasAlreadyRequested])

  // Map existing data if fetched
  useEffect(() => {
    if (data) {
      // Section and Block mapping
      const mappedSections: Section[] = data.sections
        ? data.sections.map((section) => ({
            sectionNumber: section.sectionNumber,
            title: section.title,
            blocks: section.blocks.map((block) => {
              if (block.startTime || block.endTime)
                toggleInput(block.id, 'time')
              if (block.price > 0) toggleInput(block.id, 'price')
              if (block.location) toggleInput(block.id, 'location')
              const routeToNext = block.routeToNext
                ? {
                    sourceBlockId: block.routeToNext.sourceBlockId,
                    destinationBlockId: block.routeToNext.destinationBlockId,
                    distance: block.routeToNext.distance,
                    duration: block.routeToNext.duration,
                    polyline: block.routeToNext.polyline,
                    transportMode: block.routeToNext
                      .transportMode as TransportMode,
                  }
                : undefined
              const routeFromPrevious = block.routeFromPrevious
                ? {
                    sourceBlockId: block.routeFromPrevious.sourceBlockId,
                    destinationBlockId:
                      block.routeFromPrevious.destinationBlockId,
                    distance: block.routeFromPrevious.distance,
                    duration: block.routeFromPrevious.duration,
                    polyline: block.routeFromPrevious.polyline,
                    transportMode: block.routeFromPrevious
                      .transportMode as TransportMode,
                  }
                : undefined
              return {
                id: block.id,
                blockType: block.blockType,
                title: block.title,
                description: block.description,
                startTime: block.startTime,
                endTime: block.endTime,
                location: block.location,
                price: block.price,
                routeToNext,
                routeFromPrevious,
              }
            }),
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
      initialItineraryData.current = {
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        startDate: data.startDate,
        endDate: data.endDate,
        tags: mappedTags,
        sections: mappedSections,
      } as CreateItineraryDto
      setItineraryData(initialItineraryData.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  // Load saved itinerary data from local storage
  useEffect(() => {
    try {
      const savedItineraryJSON = localStorage.getItem(SAVED_ITINERARY_KEY)

      if (savedItineraryJSON) {
        const savedItinerary = JSON.parse(
          savedItineraryJSON
        ) as CreateItineraryDto

        initialItineraryData.current = savedItinerary
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
    const checkIsBlockModified = (section: Section, section_index: number) => {
      return section.blocks?.some((block, index) => {
        const initialBlock =
          initialItineraryData.current.sections[section_index]?.blocks?.[index]
        return (
          block.title !== initialBlock?.title ||
          block.description !== initialBlock?.description ||
          block.startTime !== initialBlock?.startTime ||
          block.endTime !== initialBlock?.endTime ||
          block.location !== initialBlock?.location
        )
      })
    }

    const checkUnsavedChanges = () => {
      // Check if there are any blocks with modified data
      const isBlocksModified =
        itineraryData.sections.length !==
          initialItineraryData.current.sections.length ||
        itineraryData.sections.some((section, section_index) =>
          checkIsBlockModified(section, section_index)
        )
      const isTitleModified =
        itineraryData.title !== initialItineraryData.current.title
      const isDatesModified =
        itineraryData.startDate !== initialItineraryData.current.startDate ||
        itineraryData.endDate !== initialItineraryData.current.endDate
      const isTagsModified =
        (itineraryData.tags?.length ?? 0) !==
          (initialItineraryData.current.tags?.length ?? 0) ||
        (itineraryData.tags?.some((tag, tag_index) => {
          return tag !== initialItineraryData.current.tags?.[tag_index]
        }) ??
          false)
      const isCoverModified =
        itineraryData.coverImage !== initialItineraryData.current.coverImage
      setHasUnsavedChanges(
        isBlocksModified ||
          isTitleModified ||
          isDatesModified ||
          isTagsModified ||
          isCoverModified
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

  const updateTransportMode = async (
    blockId: string,
    transportMode: TransportMode
  ): Promise<boolean> => {
    // First find the block and its next block to get origin and destination coordinates
    let originLocation: string | undefined
    let destinationLocation: string | undefined
    let sourceBlockId: string | undefined
    let destinationBlockId: string | undefined

    for (const section of itineraryData.sections) {
      if (!section.blocks) continue

      const blockIndex = section.blocks.findIndex(
        (block) => block.id === blockId
      )
      if (blockIndex !== -1 && blockIndex < section.blocks.length - 1) {
        const currentBlock = section.blocks[blockIndex]
        const nextBlock = section.blocks[blockIndex + 1]

        if (currentBlock.location && nextBlock.location) {
          originLocation = currentBlock.location
          destinationLocation = nextBlock.location
          sourceBlockId = currentBlock.id
          destinationBlockId = nextBlock.id
          break
        }
      }
    }

    // If we have origin and destination, recalculate the route
    if (
      originLocation &&
      destinationLocation &&
      sourceBlockId &&
      destinationBlockId
    ) {
      try {
        // Calculate new route with updated transport mode
        const routeData = await calculateRoute(
          originLocation,
          destinationLocation,
          transportMode
        )

        if (routeData) {
          const routeObject: Route = {
            sourceBlockId,
            destinationBlockId,
            distance: routeData.distance,
            duration: routeData.duration,
            polyline: routeData.polyline,
            transportMode,
          }

          // Update itinerary data with new route information
          setItineraryData((prev) => {
            const updatedSections = prev.sections.map((section) => {
              if (!section.blocks) return section

              // Find the source block
              const sourceBlockIndex = section.blocks.findIndex(
                (block) => block.id === sourceBlockId
              )
              if (
                sourceBlockIndex !== -1 &&
                sourceBlockIndex < section.blocks.length - 1
              ) {
                const updatedBlocks = [...section.blocks]

                // Update source block
                const sourceBlock = { ...updatedBlocks[sourceBlockIndex] }
                sourceBlock.routeToNext = routeObject
                updatedBlocks[sourceBlockIndex] = sourceBlock

                // Update destination block
                const destBlock = { ...updatedBlocks[sourceBlockIndex + 1] }
                destBlock.routeFromPrevious = routeObject
                updatedBlocks[sourceBlockIndex + 1] = destBlock

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
          return true
        } else {
          return false
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Gagal memperbarui rute dengan mode transportasi baru')
        return false
      }
    } else {
      toast.error('Data lokasi tidak ditemukan untuk perhitungan rute')
      return false
    }
  }

  const updateRoutesBetweenBlocks = async (
    sections: Section[],
    blockId?: string
  ) => {
    const updatedSections = sections.map((section) => ({
      ...section,
      blocks: section.blocks ? [...section.blocks] : undefined,
    }))

    const updateBlockInSection = (
      sectionIdx: number,
      blockIdx: number,
      newBlock: Block
    ) => {
      if (!updatedSections[sectionIdx].blocks) return
      updatedSections[sectionIdx].blocks[blockIdx] = newBlock
    }

    const canCalculateRoute = (source: Block, dest: Block): boolean =>
      source.blockType === 'LOCATION' &&
      dest.blockType === 'LOCATION' &&
      !!source.location &&
      !!dest.location

    const calculateAndUpdateRoute = async (
      sourceBlock: Block,
      destBlock: Block
    ) => {
      if (!canCalculateRoute(sourceBlock, destBlock)) {
        return {
          updatedSource: { ...sourceBlock, routeToNext: undefined },
          updatedDest: { ...destBlock, routeFromPrevious: undefined },
        }
      }

      try {
        const transportMode =
          sourceBlock.routeToNext?.transportMode ?? TransportMode.DRIVE
        const routeData = await calculateRoute(
          sourceBlock.location!,
          destBlock.location!,
          transportMode
        )
        if (routeData) {
          const routeObject: Route = {
            sourceBlockId: sourceBlock.id,
            destinationBlockId: destBlock.id,
            distance: routeData.distance,
            duration: routeData.duration,
            polyline: routeData.polyline,
            transportMode,
          }
          return {
            updatedSource: { ...sourceBlock, routeToNext: routeObject },
            updatedDest: { ...destBlock, routeFromPrevious: routeObject },
          }
        } else {
          return {
            updatedSource: { ...sourceBlock, routeToNext: undefined },
            updatedDest: { ...destBlock, routeFromPrevious: undefined },
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Failed to calculate route between locations')
        return {
          updatedSource: { ...sourceBlock, routeToNext: undefined },
          updatedDest: { ...destBlock, routeFromPrevious: undefined },
        }
      }
    }

    const collectPairs = (blockId?: string) => {
      if (blockId) return collectPairsForBlock(blockId, updatedSections)
      return collectAllPairs(updatedSections)
    }

    const collectPairsForBlock = (
      blockId: string,
      sections: typeof updatedSections
    ) => {
      const pairs: Array<{ sectionIdx: number; currentBlockIdx: number }> = []
      sections.forEach((section, sIdx) => {
        if (!section.blocks) return
        const blockIdx = section.blocks.findIndex((b) => b.id === blockId)
        if (blockIdx > 0)
          pairs.push({ sectionIdx: sIdx, currentBlockIdx: blockIdx - 1 })
        if (blockIdx >= 0 && blockIdx < section.blocks.length - 1)
          pairs.push({ sectionIdx: sIdx, currentBlockIdx: blockIdx })
      })
      return pairs
    }

    const collectAllPairs = (sections: typeof updatedSections) => {
      const pairs: Array<{ sectionIdx: number; currentBlockIdx: number }> = []
      sections.forEach((section, sIdx) => {
        if (!section.blocks || section.blocks.length < 2) return
        for (let bIdx = 0; bIdx < section.blocks.length - 1; bIdx++) {
          pairs.push({ sectionIdx: sIdx, currentBlockIdx: bIdx })
        }
      })
      return pairs
    }

    const pairs = collectPairs(blockId)

    for (const { sectionIdx, currentBlockIdx } of pairs) {
      const section = updatedSections[sectionIdx]
      if (!section.blocks || currentBlockIdx >= section.blocks.length - 1)
        continue
      const currentBlock = section.blocks[currentBlockIdx]
      const nextBlock = section.blocks[currentBlockIdx + 1]
      const { updatedSource, updatedDest } = await calculateAndUpdateRoute(
        currentBlock,
        nextBlock
      )
      updateBlockInSection(sectionIdx, currentBlockIdx, updatedSource)
      updateBlockInSection(sectionIdx, currentBlockIdx + 1, updatedDest)
    }

    return updatedSections
  }

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

  const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItineraryData((prev) => ({
      ...prev,
      description: e.target.value,
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

  const addLocationToSection = (
    sectionNumber: number,
    title: string,
    location: string
  ) => {
    setItineraryData((prev) => {
      const blockId = v4()
      const updatedSections = prev.sections.map((section) => {
        if (section.sectionNumber === sectionNumber) {
          const newBlock = {
            id: blockId,
            blockType: 'LOCATION',
            title,
            description: '',
            location,
          }
          return {
            ...section,
            blocks: [...(section.blocks ?? []), newBlock],
          }
        }
        return section
      })
      const result = {
        ...prev,
        sections: updatedSections,
      }
      setTimeout(() => void updateRoutes(blockId), 0)
      return result
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

  const updateRoutes = async (blockId?: string) => {
    const updatedSections = await updateRoutesBetweenBlocks(
      itineraryDataRef.current.sections,
      blockId
    )
    setItineraryData((prev) => ({
      ...prev,
      sections: updatedSections,
    }))
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
    if (field === 'location') {
      setTimeout(() => void updateRoutes(blockId), 100)
    }
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
    setItineraryData((prev) => {
      const updatedSections = filterBlockFromSections(prev.sections, blockId)
      return {
        ...prev,
        sections: updatedSections,
      }
    })
    if (timeWarning && timeWarning.blockId === blockId) {
      setTimeWarning(null)
    }
    setTimeout(() => void updateRoutes(), 0)
  }

  const filterBlockFromSections = (
    sections: Section[],
    blockId: string
  ): Section[] => {
    // First, find the block and its position
    let blockToRemove: Block | null = null
    let blockSectionIndex = -1
    let blockIndex = -1

    sections.forEach((section, sIndex) => {
      if (!section.blocks) return

      const index = section.blocks.findIndex((block) => block.id === blockId)
      if (index !== -1) {
        blockToRemove = section.blocks[index]
        blockSectionIndex = sIndex
        blockIndex = index
      }
    })

    // Now process all sections, handling route connections
    return sections.map((section, sectionIndex) => {
      if (!section.blocks) return section

      // If this is the section containing the block to remove
      if (sectionIndex === blockSectionIndex) {
        const updatedBlocks = [...section.blocks]

        // Clear route connections with adjacent blocks
        if (blockIndex > 0) {
          // Clear routeToNext from previous block
          updatedBlocks[blockIndex - 1] = {
            ...updatedBlocks[blockIndex - 1],
            routeToNext: undefined,
          }
        }

        if (blockIndex < updatedBlocks.length - 1) {
          // Clear routeFromPrevious from next block
          updatedBlocks[blockIndex + 1] = {
            ...updatedBlocks[blockIndex + 1],
            routeFromPrevious: undefined,
          }
        }

        // Remove the block
        updatedBlocks.splice(blockIndex, 1)

        return {
          ...section,
          blocks: updatedBlocks,
        }
      }

      return section
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

      setTimeout(() => void updateRoutes(), 0)
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

      setTimeout(() => void updateRoutes(), 0)
    }
  }

  const submitItinerary = async (submissionData: object) => {
    const validUmami = () => typeof window !== 'undefined' && window.umami
    const isCreateAndValidUmami = () => !itineraryId && validUmami()

    try {
      const fetchCreateItinerary = async () => {
        return await customFetch<CreateItineraryResponse>('/itineraries', {
          method: 'POST',
          body: customFetchBody(submissionData),
          credentials: 'include',
          isAuthorized: true,
        })
      }

      const fetchUpdateItinerary = async () => {
        return await customFetch<CreateItineraryResponse>(
          `/itineraries/${itineraryId}`,
          {
            method: 'PATCH',
            body: customFetchBody(submissionData),
            credentials: 'include',
            isAuthorized: true,
          }
        )
      }

      const response = itineraryId
        ? await fetchUpdateItinerary()
        : await fetchCreateItinerary()

      if (!response.success) {
        if (isCreateAndValidUmami()) {
          window.umami.track('create_itinerary_fail')
        }
        throw new Error('Failed to create or edit itinerary')
      }

      setHasUnsavedChanges(false)
      toast(`Itinerary ${itineraryId ? 'updated' : 'created'} successfully`)

      if (isCreateAndValidUmami()) {
        window.umami.track('create_itinerary_success')
      }

      router.push(`/itinerary/${response.id}`)
    } catch (error) {
      if (isCreateAndValidUmami()) {
        window.umami.track('create_itinerary_fail')
      }
      throw error
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

    if (!isAuthenticated) {
      localStorage.setItem(SAVED_ITINERARY_KEY, JSON.stringify(itineraryData))
      setHasUnsavedChanges(false)
      toast.info('Silakan login untuk menyimpan itinerary Anda')
      redirect(
        isLaunching ? '/login?redirect=/itinerary/create' : '/#praregistrasi'
      )
    }

    const remainingFeedbacks = feedbackItems

    if (remainingFeedbacks.length > 0) {
      setIsConfirmModalOpen(true)
      return
    }

    // If user is authenticated, proceed with normal submission
    setIsSubmitting(true)
    try {
      const submissionData = {
        ...itineraryData,
        sections: itineraryData.sections.map((section) => ({
          ...section,
          blocks:
            section.blocks?.map((block) => {
              // Create a new object without ID but preserving route information
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { id, ...blockWithoutId } = block
              const routeToNext = block.routeToNext
                ? {
                    ...block.routeToNext,
                    sourceBlockId: block.routeToNext.sourceBlockId,
                    destinationBlockId: block.routeToNext.destinationBlockId,
                  }
                : undefined
              const routeFromPrevious = block.routeFromPrevious
                ? {
                    ...block.routeFromPrevious,
                    sourceBlockId: block.routeFromPrevious.sourceBlockId,
                    destinationBlockId:
                      block.routeFromPrevious.destinationBlockId,
                  }
                : undefined
              return {
                ...blockWithoutId,
                routeToNext,
                routeFromPrevious,
              }
            }) ?? [],
        })),
      }
      await submitItinerary(submissionData)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error('Error creating or updating itinerary:', error)
      toast.error(
        `Failed to ${itineraryId ? 'update' : 'create'} itinerary. Please try again.`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGenerateFeedback = async () => {
    if (
      !itineraryData?.title ||
      itineraryData.title === 'Itinerary Tanpa Judul'
    ) {
      toast.error('Itinerary harus memiliki judul')
      return
    }

    if (
      itineraryData.sections.length === 1 &&
      (itineraryData.sections[0].blocks?.length ?? 0) <= 1
    ) {
      toast.error('Itinerary harus memiliki setidaknya satu bagian.')
      return
    }

    const submissionData = {
      itineraryData: {
        title: itineraryData.title,
        description: itineraryData.description,
        coverImage: itineraryData.coverImage,
        startDate: itineraryData.startDate,
        endDate: itineraryData.endDate,
        sections: itineraryData.sections.map((section) => ({
          title: section.title,
          blocks:
            section.blocks?.map((block) => {
              if (block.blockType === 'LOCATION') {
                return {
                  blockType: block.blockType,
                  title: block.title,
                  description: block.description,
                  startTime: block.startTime,
                  endTime: block.endTime,
                  price: block.price,
                }
              } else if (block.blockType === 'NOTE') {
                return {
                  blockType: block.blockType,
                  description: block.description,
                }
              }
              return {}
            }) ?? [],
        })),
      },
    }

    setIsGenerating(true)

    try {
      const response = await customFetch<{ feedback: FeedbackItem[] }>(
        '/gemini/generate-feedback',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData),
        }
      )
      setFeedbackItems(response.feedback)
      toast.success('Feedback berhasil di-generate')
    } catch (error) {
      toast.error('Gagal generate feedback. Silahkan coba lagi')
    } finally {
      setIsGenerating(false)
    }
  }

  const removeFeedbackForField = (
    sectionIndex: number,
    blockIndex: number,
    field: 'title' | 'description' | 'startTime' | 'endTime' | 'price'
  ) => {
    setFeedbackItems((prev) =>
      prev.filter(
        (item) =>
          item.target.sectionIndex !== sectionIndex ||
          item.target.blockIndex !== blockIndex ||
          item.target.field !== field
      )
    )
  }

  return (
    <div className="flex max-h-screen">
      <div className="container max-w-4xl mx-auto p-4 pt-24 min-h-screen max-h-screen overflow-auto">
        <ItineraryHeader
          title={itineraryData.title}
          description={itineraryData.description}
          coverImage={itineraryData.coverImage}
          onTitleChange={handleTitleChange}
          onDescChange={handleDescChange}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onGenerateFeedback={handleGenerateFeedback}
          isGenerating={isGenerating}
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
          feedbackItems={feedbackItems}
          removeFeedbackForField={removeFeedbackForField}
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
          onTransportModeChange={updateTransportMode}
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
        {feedbackItems.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Tips</h3>
            <div className="flex flex-col gap-4">
              {feedbackItems.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-[#0073E6] rounded-md shadow-md flex items-start"
                  style={{ boxShadow: '0px 0px 10px rgba(0, 115, 230, 0.5)' }}
                >
                  <div className="flex-1">
                    <p className="font-semibold">
                      Hari {item.target.sectionIndex + 1} - Blok{' '}
                      {item.target.blockIndex + 1}
                      {item.target.field && ` (${item.target.field})`}
                    </p>
                    <p>{item.suggestion}</p>
                  </div>
                  <div className="ml-4 text-[#0073E6] drop-shadow-[0_4px_6px_rgba(0,115,230,1.5)]">
                    <Lightbulb size={48} strokeWidth={1} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-full min-h-screen hidden md:block">
        <Maps
          itineraryData={itineraryData.sections}
          addLocationToSection={addLocationToSection}
          isEditing
        />
      </div>
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center font-roboto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Apakah anda yakin?
            </h2>
            <p className="text-md mb-4">
              Masih ada tips untuk mempercantik itinerary-mu
            </p>
            <div className="flex justify-center space-x-2">
              <button
                className="px-8 py-2 border-2 border-[#016CD7] bg-white rounded text-[#014285]"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Batal
              </button>
              <button
                className="px-8 py-2 bg-gradient-to-r from-[#016CD7] to-[#014285] text-white items-center rounded"
                onClick={handleSubmit}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
