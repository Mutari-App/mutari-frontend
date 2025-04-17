'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { X, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { CreateItineraryDto, Tag } from '../interface'

interface TagSelectorProps {
  selectedTags: string[]
  onChangeAction: (tags: string[]) => void
  availableTags: Tag[]
  isContingency: boolean
  setItineraryDataAction: React.Dispatch<
    React.SetStateAction<CreateItineraryDto>
  >
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onChangeAction,
  availableTags,
  isContingency,
  setItineraryDataAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  const removeTag = (tagId: string) => {
    setItineraryDataAction((prev) => ({
      ...prev,
      tags: prev.tags?.filter((id) => id !== tagId) ?? [],
    }))
  }

  const getSelectedTagNames = () => {
    return (selectedTags ?? [])
      .map((tagId) => {
        const tag = availableTags.find((t) => t.id === tagId)
        return tag ? tag.name : ''
      })
      .filter(Boolean)
  }

  // Handle clicks outside the component to close the popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside both the input and dropdown
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 mb-3 sm:items-center md:items-start lg:items-center">
      <div className="relative">
        <div className="relative w-44 lg:w-48 bg-[#E5F1FF] rounded-md">
          <Input
            ref={inputRef}
            type="text"
            className="pr-10 h-9 text-sm bg-transparent border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[#004080] placeholder:text-[#004080] placeholder:opacity-70 font-medium"
            placeholder="Tambahkan Tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            disabled={isContingency}
          ></Input>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-4 w-4 text-[#004080]" />
          </div>
        </div>

        {isFocused && (
          <div
            ref={dropdownRef}
            className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg"
          >
            <div className="max-h-60 overflow-y-auto space-y-2 p-3">
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
          </div>
        )}
      </div>

      {selectedTags && selectedTags.length > 0 && (
        <div className="relative w-full overflow-auto">
          <div className="overflow-fade-container">
            <div id="fadeLeft" className="fade-left"></div>
            <div id="fadeRight" className="fade-right"></div>
            <div
              className="flex gap-2 overflow-auto w-full content-container"
              id="tagContainer"
              onScroll={(e) => {
                const container = e.currentTarget
                const isScrollable =
                  container.scrollWidth > container.clientWidth
                const scrolledToStart = container.scrollLeft <= 5
                const scrolledToEnd =
                  container.scrollLeft + container.clientWidth >=
                  container.scrollWidth - 5

                const parent = container.parentElement

                // Toggle classes based on overflow and scroll position
                if (isScrollable && parent) {
                  parent.classList.add('has-overflow')

                  if (!scrolledToStart) {
                    parent.classList.add('scrolled-left')
                  } else {
                    parent.classList.remove('scrolled-left')
                  }

                  if (scrolledToEnd) {
                    parent.classList.add('scrolled-right')
                  } else {
                    parent.classList.remove('scrolled-right')
                  }
                } else if (parent) {
                  parent.classList.remove(
                    'has-overflow',
                    'scrolled-left',
                    'scrolled-right'
                  )
                }
              }}
              ref={(el) => {
                if (el) {
                  // Initial check on mount
                  const isScrollable = el.scrollWidth > el.clientWidth
                  if (isScrollable && el.parentElement) {
                    el.parentElement.classList.add('has-overflow')
                  } else if (el.parentElement) {
                    el.parentElement.classList.remove(
                      'has-overflow',
                      'scrolled-left',
                      'scrolled-right'
                    )
                  }

                  // Re-check on window resize
                  window.addEventListener('resize', () => {
                    const isScrollable = el.scrollWidth > el.clientWidth
                    if (isScrollable && el.parentElement) {
                      el.parentElement.classList.add('has-overflow')
                    } else if (el.parentElement) {
                      el.parentElement.classList.remove(
                        'has-overflow',
                        'scrolled-left',
                        'scrolled-right'
                      )
                    }
                  })
                }
              }}
            >
              {getSelectedTagNames().map((tagName, index) => (
                <Badge
                  key={`tag-${tagName}-${selectedTags[index]}`}
                  variant="secondary"
                  className="flex items-center gap-1 bg-[#024C98] text-white rounded-full px-2 py-1"
                >
                  {tagName}
                  {!isContingency && (
                    <button
                      onClick={() => removeTag(selectedTags[index])}
                      className="ml-1 rounded-full hover:bg-white hover:text-[#024C98] p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
