import * as React from 'react'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

interface TimePickerProps {
  value?: Date
  onChange?: (date?: Date) => void
  label?: string
}

export function TimePicker({ value, onChange, label }: TimePickerProps) {
  const [hours, setHours] = React.useState<number>(value ? value.getHours() : 0)
  const [minutes, setMinutes] = React.useState<number>(
    value ? value.getMinutes() : 0
  )

  const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = parseInt(event.target.value)
    if (isNaN(newHours) || newHours < 0 || newHours > 23) return
    setHours(newHours)
    updateTime(newHours, minutes)
  }

  const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = parseInt(event.target.value)
    if (isNaN(newMinutes) || newMinutes < 0 || newMinutes > 59) return
    setMinutes(newMinutes)
    updateTime(hours, newMinutes)
  }

  const updateTime = (h: number, m: number) => {
    if (!onChange) return
    const date = new Date()
    if (value) {
      date.setFullYear(value.getFullYear(), value.getMonth(), value.getDate())
    }
    date.setHours(h, m, 0, 0)
    onChange(date)
  }

  React.useEffect(() => {
    if (value) {
      setHours(value.getHours())
      setMinutes(value.getMinutes())
    }
  }, [value])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-6 w-20 text-xs justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          {value ? format(value, 'HH:mm') : `${label ?? 'Select time'}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex gap-2 items-center">
          <div className="grid gap-1 text-center">
            <Label htmlFor="hours" className="text-xs">
              Jam
            </Label>
            <input
              id="hours"
              className="w-12 p-1 border rounded text-center"
              value={hours.toString().padStart(2, '0')}
              onChange={handleHoursChange}
              type="number"
              min={0}
              max={23}
            />
          </div>
          <div className="text-xl mt-4">:</div>
          <div className="grid gap-1 text-center">
            <Label htmlFor="minutes" className="text-xs">
              Menit
            </Label>
            <input
              id="minutes"
              className="w-12 p-1 border rounded text-center"
              value={minutes.toString().padStart(2, '0')}
              onChange={handleMinutesChange}
              type="number"
              min={0}
              max={59}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
