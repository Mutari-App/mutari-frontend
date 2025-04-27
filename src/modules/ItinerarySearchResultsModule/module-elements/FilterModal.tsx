import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Search, ArrowDown, ArrowUp, AlertTriangle } from 'lucide-react'
import { type ItineraryFilters } from '../interface'

interface FilterModalProps {
  open: boolean
  onClose: () => void
  filters: ItineraryFilters
  onApplyFilters: (filters: ItineraryFilters) => void
  availableTags: { id: string; name: string }[]
}

const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  filters,
  onApplyFilters,
  availableTags,
}) => {
  const [localFilters, setLocalFilters] = useState<ItineraryFilters>({
    ...filters,
  })
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    filters.tags ? filters.tags.split(',') : []
  )
  const [minDays, setMinDays] = useState<string>(filters.minDaysCount ?? '')
  const [maxDays, setMaxDays] = useState<string>(filters.maxDaysCount ?? '')
  const [tagSearchQuery, setTagSearchQuery] = useState('')
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [isRangeValid, setIsRangeValid] = useState(true)

  // Refs for handling clicks outside
  const tagSearchRef = useRef<HTMLDivElement>(null)
  const tagInputRef = useRef<HTMLInputElement>(null)

  // Filter available tags based on search query
  const filteredTags = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase()) &&
      !selectedTagIds.includes(tag.id)
  )

  // Reset local filters when the modal opens with new props
  useEffect(() => {
    if (open) {
      setLocalFilters({ ...filters })
      setSelectedTagIds(filters.tags ? filters.tags.split(',') : [])

      setMinDays(filters.minDaysCount ?? '')
      setMaxDays(filters.maxDaysCount ?? '')
      setTagSearchQuery('')

      // Validate the initial range
      validateRange(filters.minDaysCount ?? '', filters.maxDaysCount ?? '')
    }
  }, [open, filters])

  // Handle clicks outside the tag search container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tagSearchRef.current &&
        !tagSearchRef.current.contains(event.target as Node)
      ) {
        setShowTagDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Validate the range whenever min or max changes
  useEffect(() => {
    validateRange(minDays, maxDays)
  }, [minDays, maxDays])

  const validateRange = (min: string, max: string) => {
    // If both are empty, the range is valid (no days filter)
    if (min === '' && max === '') {
      setIsRangeValid(true)
      return
    }
    // If only one is empty, consider it valid (one-sided range)
    if (min === '' || max === '') {
      setIsRangeValid(true)
      return
    }
    const minValue = parseInt(min)
    const maxValue = parseInt(max)
    if (minValue > maxValue) {
      setIsRangeValid(false)
    } else {
      setIsRangeValid(true)
    }
  }

  const handleApply = () => {
    const updatedFilters: ItineraryFilters = {
      ...localFilters,
      tags: selectedTagIds.join(','),
      minDaysCount: minDays,
      maxDaysCount: maxDays,
    }
    onApplyFilters(updatedFilters)
    onClose()
  }

  const handleReset = () => {
    setLocalFilters({
      tags: '',
      sortBy: '',
      order: '',
    })
    setSelectedTagIds([])
    setMinDays('')
    setMaxDays('')
    setTagSearchQuery('')
    setIsRangeValid(true)
  }

  const toggleSortOrder = () => {
    setLocalFilters({
      ...localFilters,
      order: localFilters.order === 'asc' ? 'desc' : 'asc',
    })
  }

  const handleMinDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty or positive integers
    if (value === '' || /^\d+$/.test(value)) {
      setMinDays(value)
    }
  }

  const handleMaxDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty or positive integers
    if (value === '' || /^\d+$/.test(value)) {
      setMaxDays(value)
    }
  }

  const addTag = (tagId: string) => {
    if (!selectedTagIds.includes(tagId)) {
      setSelectedTagIds([...selectedTagIds, tagId])
      // Keep dropdown open and focus on input after selecting a tag
      setTimeout(() => {
        if (tagInputRef.current) {
          tagInputRef.current.focus()
        }
      }, 0)
    }
  }

  const removeTag = (tagId: string) => {
    setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId))
  }

  const renderSelectedTags = () => {
    return selectedTagIds.map((tagId) => {
      const tag = availableTags.find((t) => t.id === tagId)
      if (!tag) return null
      return (
        <Badge
          key={tagId}
          variant="secondary"
          className="mr-1 mb-1 bg-blue-100 text-[#024C98]"
        >
          {tag.name}
          <button
            className="ml-1 rounded-full outline-none"
            onClick={() => removeTag(tagId)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Hapus {tag.name}</span>
          </button>
        </Badge>
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle>Filter Itinerary</DialogTitle>
          <DialogDescription>
            Sesuaikan pencarian anda dengan filter untuk menemukan itinerary
            yang sempurna.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-2">
          {/* Tags Filter with Search */}
          <div className="grid gap-2">
            <div>
              <Label htmlFor="tags" className="text-sm font-medium">
                Tag
              </Label>
              {selectedTagIds.length > 0 && (
                <div className="flex flex-wrap mt-2">
                  {renderSelectedTags()}
                </div>
              )}
            </div>
            <div className="relative" ref={tagSearchRef}>
              <div className="flex items-center border rounded-md">
                <div className="pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="tagSearch"
                  ref={tagInputRef}
                  value={tagSearchQuery}
                  onChange={(e) => {
                    setTagSearchQuery(e.target.value)
                    setShowTagDropdown(true)
                  }}
                  onFocus={() => setShowTagDropdown(true)}
                  placeholder="Cari tag..."
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                />
              </div>

              {showTagDropdown && filteredTags.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-48 overflow-auto border">
                  <ul
                    className="py-1"
                    role="listbox"
                    aria-label="Available tags"
                  >
                    {filteredTags.map((tag) => (
                      <li key={tag.id} role="option" aria-selected="false">
                        <button
                          type="button"
                          className="w-full text-left px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => addTag(tag.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              addTag(tag.id)
                            }
                          }}
                        >
                          {tag.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Trip Duration */}
          <div className="grid gap-2">
            <Label>Durasi Perjalanan (Hari)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="minDays"
                  className="text-xs text-gray-500 mb-1 block"
                >
                  Minimal
                </Label>
                <Input
                  id="minDays"
                  type="number"
                  min="1"
                  value={minDays}
                  onChange={handleMinDaysChange}
                  placeholder="Opsional"
                  className={`w-full ${!isRangeValid ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
              </div>
              <div>
                <Label
                  htmlFor="maxDays"
                  className="text-xs text-gray-500 mb-1 block"
                >
                  Maksimal
                </Label>
                <Input
                  id="maxDays"
                  type="number"
                  min="1"
                  value={maxDays}
                  onChange={handleMaxDaysChange}
                  placeholder="Opsional"
                  className={`w-full ${!isRangeValid ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
              </div>
            </div>

            {/* Warning message for invalid range */}
            {!isRangeValid && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>Nilai minimal lebih besar dari nilai maksimal</span>
              </div>
            )}
          </div>

          {/* Sort Options with Toggle Icon */}
          <div className="grid gap-2">
            <Label htmlFor="sortBy">Urutkan Berdasarkan</Label>
            <div className="flex items-center gap-2">
              <Select
                value={localFilters.sortBy}
                onValueChange={(value: ItineraryFilters['sortBy']) =>
                  setLocalFilters({ ...localFilters, sortBy: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kriteria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daysCount">Durasi Perjalanan</SelectItem>
                  <SelectItem value="createdAt">Tanggal Dibuat</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleSortOrder}
                className="flex-shrink-0 hover:bg-gradient-to-r hover:from-[#0073E6]/10 hover:to-[#004080]/10 hover:text-[#0073E6]"
                title={localFilters.order === 'asc' ? 'Menaik' : 'Menurun'}
              >
                {localFilters.order === 'asc' ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row justify-between gap-2">
          <div className="p-[1.5px] flex items-center bg-gradient-to-r from-[#0073E6] to-[#004080] hover:from-[#0066cc] hover:to-[#003366] rounded-lg group">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 w-full sm-w-auto bg-white group-hover:bg-transparent group-hover:text-white border-none"
            >
              Reset Filter
            </Button>
          </div>
          <Button
            onClick={handleApply}
            size="sm"
            className="w-full sm:w-auto bg-gradient-to-r from-[#0073E6] to-[#004080] hover:from-[#0066cc] hover:to-[#003366]"
            disabled={!isRangeValid}
          >
            Terapkan Filter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default FilterModal
