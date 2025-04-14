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
import { ReminderOption } from '../interface'

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
        <Button variant="outline" size="sm">
          <BellIcon className="h-4 w-4 mr-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="flex flex-col gap-3">
          <div className="overflow-y-auto space-y-2 text-sm">
            <RadioGroup value={selectedReminder} onValueChange={onChangeAction}>
              {reminderOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-2 cursor-pointer ${
                    !option.available ? 'text-gray-500' : ''
                  }`}
                  aria-disabled={!option.available}
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
