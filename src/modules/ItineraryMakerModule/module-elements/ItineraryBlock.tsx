import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd'
import { X, GripVertical } from 'lucide-react'
import { type Block } from '../interface'
import { TimeInput } from './TimeInput'
import { PriceInput } from './PriceInput'
import { CoordinateInput } from './CoordinateInput'

interface ItineraryBlockProps {
  block: Block
  blockIndex: number
  sectionNumber: number
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
  updateBlock: <T extends keyof Block>(
    blockId: string,
    field: T,
    value: Block[T]
  ) => void
  removeBlock: (blockId: string) => void
}

export const ItineraryBlock: React.FC<ItineraryBlockProps> = ({
  block,
  blockIndex,
  sectionNumber,
  timeWarning,
  isInputVisible,
  toggleInput,
  updateBlock,
  removeBlock,
}) => {
  return (
    <Draggable
      draggableId={`block-${sectionNumber}-${blockIndex}`}
      index={blockIndex}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-4 ${snapshot.isDragging ? 'shadow-lg' : ''} ${
            timeWarning && timeWarning.blockId === block.id
              ? 'border-red-500'
              : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div
                {...provided.dragHandleProps}
                className="mr-2 cursor-grab active:cursor-grabbing flex items-center mt-2.5"
              >
                <GripVertical className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1">
                {block.blockType === 'LOCATION' ? (
                  <>
                    <div className="flex items-center mb-2">
                      <Input
                        className="text-lg font-medium border-none p-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        value={block.title}
                        onChange={(e) =>
                          updateBlock(block.id, 'title', e.target.value)
                        }
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
                      <TimeInput
                        blockId={block.id}
                        startTime={block.startTime}
                        endTime={block.endTime}
                        isVisible={isInputVisible(block.id, 'time')}
                        toggleInput={toggleInput}
                        updateBlock={updateBlock}
                        timeWarning={timeWarning}
                      />
                      <PriceInput
                        blockId={block.id}
                        price={block.price}
                        isVisible={isInputVisible(block.id, 'price')}
                        toggleInput={toggleInput}
                        updateBlock={updateBlock}
                      />
                      <CoordinateInput
                        blockId={block.id}
                        location={block.location}
                        isVisible={isInputVisible(block.id, 'location')}
                        toggleInput={toggleInput}
                        updateBlock={updateBlock}
                      />
                    </div>
                    <Input
                      placeholder="Tambahkan catatan singkat untuk lokasi ini..."
                      className="mt-2"
                      value={block.description ?? ''}
                      onChange={(e) =>
                        updateBlock(block.id, 'description', e.target.value)
                      }
                    />
                  </>
                ) : (
                  <>
                    <Textarea
                      placeholder="Masukkan Catatan"
                      className="mt-2"
                      value={block.description ?? ''}
                      onChange={(e) =>
                        updateBlock(block.id, 'description', e.target.value)
                      }
                    />
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBlock(block.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  )
}
