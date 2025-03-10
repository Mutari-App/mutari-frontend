import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tag, X } from 'lucide-react'
import { type Block } from '../interface'

interface PriceInputProps {
  blockId: string
  price?: number
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

export const PriceInput: React.FC<PriceInputProps> = ({
  blockId,
  price,
  isVisible,
  toggleInput,
  updateBlock,
}) => {
  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => toggleInput(blockId, 'price')}
        className="h-7 px-2"
      >
        <Tag className="h-4 w-4 mr-1" /> Set Harga
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md h-8">
      <Tag className="h-6 w-6 ml-1" />
      <span>Rp</span>
      <Input
        type="number"
        placeholder="50000"
        className="w-24 h-6 text-sm focus-visible:ring-1 focus-visible:ring-offset-0"
        value={price ?? ''}
        onChange={(e) =>
          updateBlock(
            blockId,
            'price',
            e.target.value ? Number(e.target.value) : undefined
          )
        }
      />
      <Button
        variant="ghost"
        size="sm"
        className="p-1 h-6"
        onClick={() => toggleInput(blockId, 'price')}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
