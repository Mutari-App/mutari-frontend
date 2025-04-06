import React from 'react'
import { Button } from '@/components/ui/button'
import { Clock, X } from 'lucide-react'
import { TimePicker } from './TimePicker'
import { type Block } from '../interface'

interface TimeInputProps {
  sectionNumber: number
  blockId: string
  startTime?: string
  endTime?: string
  isVisible: boolean
  toggleInput: (
    blockId: string,
    inputType: 'time' | 'price' | 'location'
  ) => void
  updateBlock: <T extends keyof Block>(
    blockId: string,
    field: T,
    value: Block[T]
  ) => void
  timeWarning: {
    blockId: string
    message: string
  } | null
  removeFeedbackForField: (
    sectionNumber: number,
    blockId: string,
    field: keyof Block
  ) => void
}

export const TimeInput: React.FC<TimeInputProps> = ({
  sectionNumber,
  blockId,
  startTime,
  endTime,
  isVisible,
  toggleInput,
  updateBlock,
  timeWarning,
  removeFeedbackForField,
}) => {
  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => toggleInput(blockId, 'time')}
        className="h-7 px-2"
      >
        <Clock className="h-4 w-4 mr-1" /> Set Waktu
      </Button>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md h-8">
        <Clock className="h-4 w-4 ml-1" />
        <TimePicker
          label="Awal"
          value={startTime ? new Date(startTime) : undefined}
          onChange={(date) => {
            removeFeedbackForField(sectionNumber, blockId, 'startTime')
            updateBlock(blockId, 'startTime', date?.toISOString())
          }}
        />
        <span className="mx-1">-</span>
        <TimePicker
          label="Akhir"
          value={endTime ? new Date(endTime) : undefined}
          onChange={(date) => {
            removeFeedbackForField(sectionNumber, blockId, 'startTime')
            updateBlock(blockId, 'endTime', date?.toISOString())
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-6"
          onClick={() => toggleInput(blockId, 'time')}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {timeWarning && timeWarning.blockId === blockId && (
        <div className="text-red-500 text-xs mt-1">{timeWarning.message}</div>
      )}
    </div>
  )
}
