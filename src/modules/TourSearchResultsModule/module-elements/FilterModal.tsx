import React, { useState, useEffect } from 'react'
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
import { Switch } from '@/components/ui/switch'
import { ArrowDown, ArrowUp, AlertTriangle } from 'lucide-react'
import { type TourFilters } from '../interface'

interface FilterModalProps {
  open: boolean
  onClose: () => void
  filters: TourFilters
  onApplyFilters: (filters: TourFilters) => void
}

const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  filters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<TourFilters>({
    ...filters,
  })
  const [location, setLocation] = useState<string>(filters.location ?? '')
  const [minPrice, setMinPrice] = useState<string>(filters.minPrice ?? '')
  const [maxPrice, setMaxPrice] = useState<string>(filters.maxPrice ?? '')
  const [minDuration, setMinDuration] = useState<string>(
    filters.minDuration ?? ''
  )
  const [maxDuration, setMaxDuration] = useState<string>(
    filters.maxDuration ?? ''
  )
  const [durationType, setDurationType] = useState<string>(
    filters.durationType ?? ''
  )
  const [hasAvailableTickets, setHasAvailableTickets] = useState<boolean>(
    filters.hasAvailableTickets ?? false
  )
  const [isPriceRangeValid, setIsPriceRangeValid] = useState(true)
  const [isDurationRangeValid, setIsDurationRangeValid] = useState(true)

  // Reset local filters when the modal opens with new props
  useEffect(() => {
    if (open) {
      setLocalFilters({ ...filters })
      setLocation(filters.location ?? '')
      setMinPrice(filters.minPrice ?? '')
      setMaxPrice(filters.maxPrice ?? '')
      setMinDuration(filters.minDuration ?? '')
      setMaxDuration(filters.maxDuration ?? '')
      setDurationType(filters.durationType ?? '')
      setHasAvailableTickets(filters.hasAvailableTickets ?? false)

      // Validate the initial ranges
      validatePriceRange(filters.minPrice ?? '', filters.maxPrice ?? '')
      validateDurationRange(
        filters.minDuration ?? '',
        filters.maxDuration ?? ''
      )
    }
  }, [open, filters])

  // Validate the ranges whenever min or max changes
  useEffect(() => {
    validatePriceRange(minPrice, maxPrice)
  }, [minPrice, maxPrice])

  useEffect(() => {
    validateDurationRange(minDuration, maxDuration)

    // Auto-set durationType to "DAY" when a duration value is entered
    if ((minDuration || maxDuration) && !durationType) {
      setDurationType('DAY')
    }
  }, [minDuration, maxDuration, durationType])

  const validatePriceRange = (min: string, max: string) => {
    // If both are empty, the range is valid (no price filter)
    if (min === '' && max === '') {
      setIsPriceRangeValid(true)
      return
    }
    // If only one is empty, consider it valid (one-sided range)
    if (min === '' || max === '') {
      setIsPriceRangeValid(true)
      return
    }
    const minValue = parseFloat(min)
    const maxValue = parseFloat(max)
    if (minValue > maxValue) {
      setIsPriceRangeValid(false)
    } else {
      setIsPriceRangeValid(true)
    }
  }

  const validateDurationRange = (min: string, max: string) => {
    // If both are empty, the range is valid (no duration filter)
    if (min === '' && max === '') {
      setIsDurationRangeValid(true)
      return
    }
    // If only one is empty, consider it valid (one-sided range)
    if (min === '' || max === '') {
      setIsDurationRangeValid(true)
      return
    }
    const minValue = parseInt(min)
    const maxValue = parseInt(max)
    if (minValue > maxValue) {
      setIsDurationRangeValid(false)
    } else {
      setIsDurationRangeValid(true)
    }
  }

  const handleApply = () => {
    const updatedFilters: TourFilters = {
      ...localFilters,
      location,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      durationType,
      hasAvailableTickets,
    }
    onApplyFilters(updatedFilters)
    onClose()
  }

  const handleReset = () => {
    setLocalFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      minDuration: '',
      maxDuration: '',
      durationType: '',
      hasAvailableTickets: false,
      sortBy: '',
      order: '',
    })
    setLocation('')
    setMinPrice('')
    setMaxPrice('')
    setMinDuration('')
    setMaxDuration('')
    setDurationType('')
    setHasAvailableTickets(false)
    setIsPriceRangeValid(true)
    setIsDurationRangeValid(true)
  }

  const toggleSortOrder = () => {
    setLocalFilters({
      ...localFilters,
      order: localFilters.order === 'asc' ? 'desc' : 'asc',
    })
  }

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty or positive numbers with optional decimal
    if (value === '' || /^\d+(\.\d*)?$/.test(value)) {
      setMinPrice(value)
    }
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty or positive numbers with optional decimal
    if (value === '' || /^\d+(\.\d*)?$/.test(value)) {
      setMaxPrice(value)
    }
  }

  const handleMinDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty or positive integers
    if (value === '' || /^\d+$/.test(value)) {
      setMinDuration(value)

      // Auto-set durationType to "DAY" if a value is entered and no durationType is set
      if (value && !durationType) {
        setDurationType('DAY')
      }
    }
  }

  const handleMaxDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty or positive integers
    if (value === '' || /^\d+$/.test(value)) {
      setMaxDuration(value)

      // Auto-set durationType to "DAY" if a value is entered and no durationType is set
      if (value && !durationType) {
        setDurationType('DAY')
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle>Filter Tur</DialogTitle>
          <DialogDescription>
            Sesuaikan pencarian anda dengan filter untuk menemukan tour yang
            sempurna.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-2">
          {/* Price Range */}
          <div className="grid gap-2">
            <Label>Rentang Harga (IDR)</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="minPrice"
                  className="text-xs text-gray-500 mb-1 block"
                >
                  Minimal
                </Label>
                <Input
                  id="minPrice"
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  placeholder="Opsional"
                  className={`w-full ${!isPriceRangeValid ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
              </div>
              <div>
                <Label
                  htmlFor="maxPrice"
                  className="text-xs text-gray-500 mb-1 block"
                >
                  Maksimal
                </Label>
                <Input
                  id="maxPrice"
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  placeholder="Opsional"
                  className={`w-full ${!isPriceRangeValid ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
              </div>
            </div>

            {/* Warning message for invalid price range */}
            {!isPriceRangeValid && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>Nilai minimal lebih besar dari nilai maksimal</span>
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="grid gap-2">
            <Label>Durasi</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="minDuration"
                  className="text-xs text-gray-500 mb-1 block"
                >
                  Minimal
                </Label>
                <Input
                  id="minDuration"
                  type="number"
                  min="1"
                  value={minDuration}
                  onChange={handleMinDurationChange}
                  placeholder="Opsional"
                  className={`w-full ${!isDurationRangeValid ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
              </div>
              <div>
                <Label
                  htmlFor="maxDuration"
                  className="text-xs text-gray-500 mb-1 block"
                >
                  Maksimal
                </Label>
                <Input
                  id="maxDuration"
                  type="number"
                  min="1"
                  value={maxDuration}
                  onChange={handleMaxDurationChange}
                  placeholder="Opsional"
                  className={`w-full ${!isDurationRangeValid ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
              </div>
            </div>

            {/* Warning message for invalid duration range */}
            {!isDurationRangeValid && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>Nilai minimal lebih besar dari nilai maksimal</span>
              </div>
            )}
          </div>

          {/* Duration Type */}
          <div className="grid gap-2">
            <Label htmlFor="durationType">Tipe Durasi</Label>
            <Select
              value={durationType}
              onValueChange={(value) => setDurationType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe durasi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOUR">Jam</SelectItem>
                <SelectItem value="DAY">Hari</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Available Tickets Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="hasAvailableTickets" className="cursor-pointer">
              Hanya tampilkan yang tersedia
            </Label>
            <Switch
              id="hasAvailableTickets"
              checked={hasAvailableTickets}
              onCheckedChange={setHasAvailableTickets}
            />
          </div>

          {/* Sort Options with Toggle Icon */}
          <div className="grid gap-2">
            <Label htmlFor="sortBy">Urutkan Berdasarkan</Label>
            <div className="flex items-center gap-2">
              <Select
                value={localFilters.sortBy}
                onValueChange={(value: TourFilters['sortBy']) =>
                  setLocalFilters({ ...localFilters, sortBy: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kriteria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pricePerTicket">Harga</SelectItem>
                  <SelectItem value="duration">Durasi</SelectItem>
                  <SelectItem value="availableTickets">
                    Tiket Tersedia
                  </SelectItem>
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
            disabled={!isPriceRangeValid || !isDurationRangeValid}
          >
            Terapkan Filter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default FilterModal
