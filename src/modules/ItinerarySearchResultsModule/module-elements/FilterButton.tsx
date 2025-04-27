import React from 'react'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal } from 'lucide-react'

interface FilterButtonProps {
  onClick: () => void
  filtersApplied: boolean
}

const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  filtersApplied,
}) => {
  return (
    <div className="relative">
      <Button
        onClick={onClick}
        size="sm"
        className="text-white hover:text-white w-12 sm:w-16 rounded-full bg-gradient-to-r from-[#0073E6] to-[#004080] hover:from-[#0066cc] hover:to-[#003366] flex items-center justify-center"
        aria-label="Open filters"
      >
        <SlidersHorizontal className="h-4 sm:h-5 w-4 sm:w-5" />
      </Button>
      {filtersApplied && (
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border border-white" />
      )}
    </div>
  )
}

export default FilterButton
