import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  DragDropContext,
  Droppable,
  type DropResult,
  type DroppableProvided,
} from '@hello-pangea/dnd'
import {
  Plus,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Trash,
} from 'lucide-react'
import { type FeedbackItem, type Block, type Section } from '../interface'
import { type TransportMode } from '@/utils/maps'
import { ItineraryBlock } from '../module-elements/ItineraryBlock'
import { SECTION_COLORS } from '../constants'
import CustomPin from '../module-elements/CustomPin'

interface ItinerarySectionsProps {
  sections: Section[]
  feedbackItems: FeedbackItem[]
  removeFeedbackForField: (
    sectionIndex: number,
    blockId: string,
    field: 'title' | 'description' | 'time' | 'price'
  ) => void
  timeWarning: {
    blockId: string
    message: string
  } | null
  isInputVisible: (
    blockId: string,
    inputType: 'time' | 'price' | 'location'
  ) => boolean
  toggleInput: (
    blockId: string,
    inputType: 'time' | 'price' | 'location'
  ) => void
  updateSectionTitle: (sectionNumber: number, title: string) => void
  addSection: (position?: 'after' | 'before', relativeTo?: number) => void
  removeSection: (sectionNumber: number) => void
  moveSection: (sectionNumber: number, direction: 'up' | 'down') => void
  addBlock: (sectionNumber: number, blockType: string) => void
  updateBlock: <T extends keyof Block>(
    blockId: string,
    field: T,
    value: Block[T]
  ) => void
  removeBlock: (blockId: string) => void
  handleDragEnd: (result: DropResult) => void
  onTransportModeChange?: (
    blockId: string,
    mode: TransportMode
  ) => Promise<boolean>
  setPositionToView: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral | null>
  >
}

export const ItinerarySections: React.FC<ItinerarySectionsProps> = ({
  sections,
  timeWarning,
  feedbackItems,
  removeFeedbackForField,
  isInputVisible,
  toggleInput,
  updateSectionTitle,
  addSection,
  removeSection,
  moveSection,
  addBlock,
  updateBlock,
  removeBlock,
  handleDragEnd,
  onTransportModeChange,
  setPositionToView,
}) => {
  // Helper function to check if a block should show route information
  const shouldShowRoute = (section: Section, blockIndex: number): boolean => {
    if (!section.blocks) return false

    // Current block must be a location block
    const currentBlock = section.blocks[blockIndex]
    if (currentBlock.blockType !== 'LOCATION' || !currentBlock.location)
      return false

    // Must have a next block that is also a location block
    const nextBlock = section.blocks[blockIndex + 1]
    if (!nextBlock || nextBlock.blockType !== 'LOCATION' || !nextBlock.location)
      return false

    // Must have route information
    return !!currentBlock.routeToNext
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {sections.map((section) => (
        <div key={section.sectionNumber} className="mb-8">
          <div className="flex items-center justify-between mb-2 gap-4">
            <Input
              className="md:text-2xl font-semibold border-none p-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={section.title}
              onChange={(e) =>
                updateSectionTitle(section.sectionNumber, e.target.value)
              }
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => addSection('before', section.sectionNumber)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Tambah bagian di atas
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => addSection('after', section.sectionNumber)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Tambah bagian di bawah
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => moveSection(section.sectionNumber, 'up')}
                  disabled={section.sectionNumber === 1}
                >
                  <ChevronUp className="mr-2 h-4 w-4" /> Pindahkan bagian ke
                  atas
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => moveSection(section.sectionNumber, 'down')}
                  disabled={section.sectionNumber === sections.length}
                >
                  <ChevronDown className="mr-2 h-4 w-4" /> Pindahkan bagian ke
                  bawah
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => removeSection(section.sectionNumber)}
                  className="text-red-500"
                >
                  <Trash className="mr-2 h-4 w-4" /> Hapus bagian
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Droppable droppableId={`section-${section.sectionNumber}`}>
            {(provided: DroppableProvided) => (
              <div
                className="min-h-px"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {section.blocks?.map((block, blockIndex) => (
                  <ItineraryBlock
                    key={`block-${section.sectionNumber}-${blockIndex}`}
                    feedbackItems={feedbackItems}
                    removeFeedbackForField={removeFeedbackForField}
                    block={block}
                    blockIndex={blockIndex}
                    sectionNumber={section.sectionNumber}
                    timeWarning={timeWarning}
                    isInputVisible={isInputVisible}
                    toggleInput={toggleInput}
                    updateBlock={updateBlock}
                    removeBlock={removeBlock}
                    showRoute={shouldShowRoute(section, blockIndex)}
                    routeInfo={block.routeToNext}
                    onTransportModeChange={onTransportModeChange}
                    setPositionToView={setPositionToView}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              size="sm"
              onClick={() => addBlock(section.sectionNumber, 'LOCATION')}
              className="flex w-28 items-center bg-gradient-to-r from-[#0073E6] to-[#004080] text-white hover:from-[#0066cc] hover:to-[#003366] rounded-lg"
            >
              <Plus className="h-4 w-4" /> Lokasi
            </Button>
            <Button
              size="sm"
              onClick={() => addBlock(section.sectionNumber, 'NOTE')}
              className="flex w-28 items-center bg-gradient-to-r from-[#0073E6] to-[#004080] text-white hover:from-[#0066cc] hover:to-[#003366] rounded-lg"
            >
              <Plus className="h-4 w-4" /> Catatan
            </Button>
          </div>
        </div>
      ))}
    </DragDropContext>
  )
}
