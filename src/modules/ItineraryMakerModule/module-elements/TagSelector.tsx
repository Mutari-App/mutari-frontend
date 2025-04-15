'use client'

import React, { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { type Tag } from '../interface'

interface TagSelectorProps {
  selectedTags: string[]
  onChangeAction: (tags: string[]) => void
  availableTags: Tag[]
  isContingency: boolean
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onChangeAction,
  availableTags,
  isContingency,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredTags = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChangeAction(selectedTags.filter((id) => id !== tagId))
    } else {
      onChangeAction([...selectedTags, tagId])
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="h-fit p-[1.5px] flex items-center bg-gradient-to-r from-[#0073E6] to-[#004080] hover:from-[#0066cc] hover:to-[#003366] rounded-lg group">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-full bg-white group-hover:bg-transparent border-none"
            disabled={isContingency}
          >
            <span className="bg-gradient-to-r from-[#0073E6] to-[#004080] group-hover:text-white text-transparent bg-clip-text flex items-center">
              Tambahkan Tag
            </span>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            className="px-3 py-2 border rounded-md text-sm"
            placeholder="Cari tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredTags.length === 0 ? (
              <div className="text-center py-2 text-sm text-gray-500">
                Tidak ada tag ditemukan
              </div>
            ) : (
              filteredTags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag.id}`}
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={() => handleToggleTag(tag.id)}
                  />
                  <label
                    htmlFor={`tag-${tag.id}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {tag.name}
                  </label>
                </div>
              ))
            )}
          </div>
          <div className="pt-2 flex justify-end">
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              className="bg-gradient-to-r from-[#0073E6] to-[#004080] text-white hover:from-[#0066cc] hover:to-[#003366]"
            >
              Selesai
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
