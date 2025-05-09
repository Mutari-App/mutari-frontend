import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd'
import { X, GripVertical, OctagonAlert } from 'lucide-react'
import { type FeedbackItem, type Block } from '../interface'
import { TimeInput } from './TimeInput'
import { PriceInput } from './PriceInput'
import { RouteInfo } from './RouteInfo'
import { feedbackForField } from '../utils'
import { TooltipField } from './TooltipField'

enum TransportMode {
  DRIVE = 'DRIVE',
  WALK = 'WALK',
  BICYCLE = 'BICYCLE',
  TRANSIT = 'TRANSIT',
  TWO_WHEELER = 'TWO_WHEELER',
}

const transportModeNames = {
  [TransportMode.DRIVE]: 'Mobil',
  [TransportMode.WALK]: 'Jalan Kaki',
  [TransportMode.BICYCLE]: 'Sepeda',
  [TransportMode.TRANSIT]: 'Transportasi Umum',
  [TransportMode.TWO_WHEELER]: 'Motor',
}
import AutocompleteInput from './AutocompleteInput'
import CustomPin from './CustomPin'
import { SECTION_COLORS } from '../constants'

interface ItineraryBlockProps {
  block: Block
  blockIndex: number
  sectionNumber: number
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
  updateBlock: <T extends keyof Block>(
    blockId: string,
    field: T,
    value: Block[T]
  ) => void
  removeBlock: (blockId: string) => void
  showRoute: boolean
  routeInfo?: {
    sourceBlockId: string
    destinationBlockId: string
    distance: number
    duration: number
    polyline?: string
    transportMode?: TransportMode
  }
  onTransportModeChange?: (
    blockId: string,
    mode: TransportMode
  ) => Promise<boolean>
  setPositionToView: React.Dispatch<
    React.SetStateAction<google.maps.LatLngLiteral | null>
  >
}

export const ItineraryBlock: React.FC<ItineraryBlockProps> = ({
  feedbackItems,
  removeFeedbackForField,
  block,
  blockIndex,
  sectionNumber,
  timeWarning,
  isInputVisible,
  toggleInput,
  updateBlock,
  removeBlock,
  showRoute,
  routeInfo,
  onTransportModeChange,
  setPositionToView,
}) => {
  return (
    <>
      <Draggable
        draggableId={`block-${sectionNumber}-${blockIndex}`}
        index={blockIndex}
      >
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`${!showRoute || !routeInfo ? 'mb-2 lg:mb-4' : ''} ${snapshot.isDragging ? 'shadow-lg' : ''} ${
              timeWarning && timeWarning.blockId === block.id
                ? 'border-red-500'
                : ''
            }`}
          >
            <CardContent className="p-1 pb-2 lg:pb-4 sm:p-2 lg:p-4">
              <div className="flex justify-between items-start">
                <div
                  {...provided.dragHandleProps}
                  className="mr-1 lg:mr-2 cursor-grab active:cursor-grabbing flex items-center mt-3 lg:mt-2.5"
                >
                  <GripVertical className="h-4 lg:h-5 w-4 lg:w-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  {block.blockType === 'LOCATION' ? (
                    <>
                      <div className="flex items-center mb-2 gap-2">
                        <CustomPin
                          number={blockIndex + 1}
                          color={SECTION_COLORS[sectionNumber % 10].class}
                        />
                        <AutocompleteInput
                          updateBlock={updateBlock}
                          blockId={block.id}
                          setPositionToView={setPositionToView}
                          title={block.title}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
                        {/* time */}
                        <TimeInput
                          sectionNumber={sectionNumber}
                          blockId={block.id}
                          startTime={block.startTime}
                          endTime={block.endTime}
                          isVisible={isInputVisible(block.id, 'time')}
                          toggleInput={toggleInput}
                          updateBlock={updateBlock}
                          removeFeedbackForField={() =>
                            removeFeedbackForField(
                              sectionNumber,
                              block.id,
                              'time'
                            )
                          }
                          timeWarning={timeWarning}
                        />
                        {feedbackForField?.(
                          feedbackItems,
                          sectionNumber,
                          block.id,
                          'LOCATION',
                          'time'
                        ) && (
                          <TooltipField
                            feedback={
                              feedbackForField(
                                feedbackItems,
                                sectionNumber,
                                block.id,
                                'LOCATION',
                                'time'
                              ) ?? undefined
                            }
                          >
                            <OctagonAlert className="text-[#B62116]" />
                          </TooltipField>
                        )}
                        {/* price */}
                        <PriceInput
                          sectionNumber={sectionNumber}
                          blockId={block.id}
                          price={block.price}
                          isVisible={isInputVisible(block.id, 'price')}
                          toggleInput={toggleInput}
                          updateBlock={updateBlock}
                          removeFeedbackForField={() =>
                            removeFeedbackForField(
                              sectionNumber,
                              block.id,
                              'price'
                            )
                          }
                        />
                        {feedbackForField?.(
                          feedbackItems,
                          sectionNumber,
                          block.id,
                          'LOCATION',
                          'price'
                        ) && (
                          <TooltipField
                            feedback={
                              feedbackForField(
                                feedbackItems,
                                sectionNumber,
                                block.id,
                                'LOCATION',
                                'price'
                              ) ?? undefined
                            }
                          >
                            <OctagonAlert className="text-[#B62116]" />
                          </TooltipField>
                        )}
                      </div>
                      <Input
                        placeholder="Tambahkan catatan singkat..."
                        className="mt-2 text-sm lg:text-base"
                        value={block.description ?? ''}
                        onChange={(e) => {
                          updateBlock(block.id, 'description', e.target.value)
                          removeFeedbackForField(
                            sectionNumber,
                            block.id,
                            'description'
                          )
                        }}
                      />
                      {feedbackForField?.(
                        feedbackItems,
                        sectionNumber,
                        block.id,
                        'LOCATION',
                        'description'
                      ) && (
                        <TooltipField
                          feedback={
                            feedbackForField(
                              feedbackItems,
                              sectionNumber,
                              block.id,
                              'LOCATION',
                              'description'
                            ) ?? undefined
                          }
                        >
                          <OctagonAlert className="text-[#B62116]" />
                        </TooltipField>
                      )}
                    </>
                  ) : (
                    <div>
                      <Textarea
                        placeholder="Masukkan Catatan"
                        className="mt-2 text-sm lg:text-base"
                        value={block.description ?? ''}
                        onChange={(e) => {
                          updateBlock(block.id, 'description', e.target.value)
                          removeFeedbackForField(
                            sectionNumber,
                            block.id,
                            'description'
                          )
                        }}
                      />
                      {feedbackForField?.(
                        feedbackItems,
                        sectionNumber,
                        block.id,
                        'NOTE',
                        'description'
                      ) && (
                        <TooltipField
                          feedback={
                            feedbackForField(
                              feedbackItems,
                              sectionNumber,
                              block.id,
                              'NOTE',
                              'description'
                            ) ?? undefined
                          }
                        >
                          <OctagonAlert className="text-[#B62116]" />
                        </TooltipField>
                      )}
                    </div>
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
      {showRoute && routeInfo && (
        <RouteInfo
          distance={routeInfo.distance}
          duration={routeInfo.duration}
          polyline={routeInfo.polyline}
          transportMode={routeInfo.transportMode}
          onTransportModeChange={async (mode) => {
            toast.loading(
              `Menghitung ulang rute dengan ${transportModeNames[mode]}...`,
              { id: 'route-calc' }
            )

            try {
              if (onTransportModeChange) {
                const success = await onTransportModeChange(block.id, mode)

                if (success) {
                  toast.success('Rute berhasil diperbarui', {
                    id: 'route-calc',
                    duration: 3000,
                  })
                  return true
                }
                return false
              }
              return false
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
              toast.error('Terjadi kesalahan saat memperbarui rute', {
                id: 'route-calc',
                duration: 3000,
              })
              return false
            }
          }}
        />
      )}
    </>
  )
}
