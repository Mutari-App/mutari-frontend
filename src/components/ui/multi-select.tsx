import React, { useState } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

export interface Option {
  label: string
  value: string
}

interface MultiSelectProps {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
  placeholder?: string
  maxDisplay?: number
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  className,
  placeholder = 'Select options...',
  maxDisplay = 3,
}) => {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item))
  }

  // Get labels for selected values
  const selectedLabels = selected.map((value) => {
    const option = options.find((opt) => opt.value === value)
    return option ? option.label : value
  })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = e.target as HTMLInputElement
    if (e.key === 'Backspace' && !input.value && selected.length > 0) {
      handleUnselect(selected[selected.length - 1])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between min-h-10 h-auto border border-input',
            className
          )}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1 items-center">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {selectedLabels.slice(0, maxDisplay).map((label, i) => (
                  <Badge
                    key={`${label}-${i}`}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {label}
                    <X
                      className="h-3 w-3 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUnselect(selected[i])
                      }}
                    />
                  </Badge>
                ))}
                {selected.length > maxDisplay && (
                  <Badge variant="secondary">
                    +{selected.length - maxDisplay}
                  </Badge>
                )}
              </>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="w-full">
          <CommandInput
            placeholder="Search options..."
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={handleKeyDown}
          />
          <CommandEmpty>No options found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {options.map((option) => {
              const isSelected = selected.includes(option.value)
              return (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange(
                      isSelected
                        ? selected.filter((value) => value !== option.value)
                        : [...selected, option.value]
                    )
                    setInputValue('')
                  }}
                >
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50'
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default MultiSelect
