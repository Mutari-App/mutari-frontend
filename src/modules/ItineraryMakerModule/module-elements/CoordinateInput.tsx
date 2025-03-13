import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, X } from 'lucide-react'
import { type Block } from '../interface'

interface CoordinateInputProps {
  blockId: string
  location?: string
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
}

export const CoordinateInput: React.FC<CoordinateInputProps> = ({
  blockId,
  location,
  isVisible,
  toggleInput,
  updateBlock,
}) => {
  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => toggleInput(blockId, 'location')}
        className="h-7 px-2"
      >
        <MapPin className="h-4 w-4 mr-1" /> Set Koordinat
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md h-8">
      <MapPin className="h-[22px] w-[22px] ml-1" />
      <Input
        className="w-36 h-6 text-sm focus-visible:ring-1 focus-visible:ring-offset-0"
        placeholder="0,0"
        value={location ?? ''}
        onChange={(e) => updateBlock(blockId, 'location', e.target.value)}
      />
      <Button
        variant="ghost"
        size="sm"
        className="p-1 h-6"
        onClick={() => toggleInput(blockId, 'location')}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
