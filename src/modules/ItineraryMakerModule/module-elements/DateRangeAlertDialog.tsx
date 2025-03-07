import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { type DateRange } from 'react-day-picker'

interface DateRangeAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pendingDateRange: DateRange | undefined
  currentSectionCount: number
  onCancel: () => void
  onConfirm: () => void
}

export function DateRangeAlertDialog({
  open,
  onOpenChange,
  pendingDateRange,
  currentSectionCount,
  onCancel,
  onConfirm,
}: DateRangeAlertDialogProps) {
  const newDayCount =
    pendingDateRange?.from && pendingDateRange?.to
      ? Math.ceil(
          Math.abs(
            pendingDateRange.to.getTime() - pendingDateRange.from.getTime()
          ) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 0

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Perubahan Tanggal</AlertDialogTitle>
          <AlertDialogDescription>
            Perubahan rentang tanggal akan mengurangi jumlah hari perjalanan
            dari {currentSectionCount} hari menjadi {newDayCount} hari. Beberapa
            bagian yang berisi data akan dihapus. Apakah Anda yakin ingin
            melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Lanjutkan</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
