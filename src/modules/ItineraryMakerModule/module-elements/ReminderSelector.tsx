'use client'

import React, { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group-item'
import { BellIcon } from 'lucide-react'
import { type ReminderOption } from '../interface'

interface ReminderSelectorProps {
  selectedReminder: string
  onChangeAction: (value: string) => void
  reminderOptions: ReminderOption[]
}

export const ReminderSelector: React.FC<ReminderSelectorProps> = ({
  selectedReminder,
  onChangeAction,
  reminderOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="p-[1.5px] flex justify-center items-center bg-gradient-to-r from-[#0073E6] to-[#004080] hover:from-[#0066cc] hover:to-[#003366] rounded-lg group">
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-white group-hover:bg-transparent border-none"
          >
            <span className="bg-gradient-to-r from-[#0073E6] to-[#004080] group-hover:text-white text-transparent bg-clip-text flex items-center">
              <BellIcon className="h-4 w-4 text-[#0073E6] group-hover:text-white" />
            </span>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="flex flex-col gap-3">
          <div className="overflow-y-auto space-y-2 text-sm">
            <RadioGroup value={selectedReminder} onValueChange={onChangeAction}>
              {reminderOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <RadioGroupItem
                    value={option.value}
                    disabled={!option.available}
                  />
                  {option.label}
                </label>
              ))}
            </RadioGroup>
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
