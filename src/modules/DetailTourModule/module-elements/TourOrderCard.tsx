'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const TourOrderCard = ({
  tourId,
  pricePerTicket,
}: {
  tourId: string
  pricePerTicket: number
}) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [guestCount, setGuestCount] = useState(1)
  const [voucherCode, setVoucherCode] = useState('')

  // For demo purposes - this would likely come from props
  const tripDetails = {
    name: 'Open Trip Baduy 2D1N',
    departureDate: selectedDate
      ? selectedDate.toLocaleDateString('id-ID')
      : '-',
    duration: '2 hari',
  }

  const handleBooking = () => {
    if (!selectedDate) {
      toast.error('Tolong pilih tanggal terlebih dahulu!')
      return
    }
    if (guestCount < 1) {
      toast.error('Tolong pilih jumlah partisipan!')
      return
    }
    // Close the dialog
    setOpen(false)

    // Navigate to the booking form page with relevant query parameters
    router.push(
      `/tour/${tourId}/booking-form?tourDate=${selectedDate?.toISOString() || ''}&guests=${guestCount}`
    )
  }

  const totalPrice = pricePerTicket * guestCount

  return (
    <div className="sticky top-4 w-full lg:w-72 bg-white p-4 rounded-xl shadow-md self-start">
      <p className="text-xl font-semibold text-gray-800 text-raleway">
        Rp{pricePerTicket.toLocaleString('id-ID')}
        <span className="text-sm"> / pax</span>
      </p>
      <Button
        className="mt-4 w-full bg-gradient-to-r from-[#016CD7] to-[#014285] text-white py-2 rounded-lg"
        onClick={() => setOpen(true)}
      >
        Pesan Sekarang
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl sm:p-12 sm:rounded-2xl text-[#024C98]">
          <div className="grid grid-cols-1 sm:px-2 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            <div>
              <DialogTitle className="font-semibold font-raleway mb-4">
                Pilih tanggal
              </DialogTitle>
              <div className="border border-[#024C98] w-fit max-w-full  sm:p-2">
                <Calendar
                  mode="single"
                  fromDate={new Date()}
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                />
              </div>
            </div>

            <div>
              <div className="mb-4">
                <DialogTitle className="font-semibold font-raleway mb-2">
                  Guest
                </DialogTitle>
                <Input
                  className="w-full"
                  placeholder="Pilih jumlah partisipan"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  type="number"
                  min="1"
                />
              </div>
              <div className="mb-4">
                <DialogTitle className="font-semibold font-raleway mb-2">
                  Kode Voucher
                </DialogTitle>
                <Input
                  className="w-full"
                  placeholder="Masukkan kode voucher (opsional)"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                />
              </div>
              <div className="mb-4 text-sm">
                <DialogTitle className="font-semibold font-raleway mb-2">
                  Ringkasan Pesanan
                </DialogTitle>
                <div className="bg-blue-100 p-4 rounded-lg">
                  <div className="font-medium">{tripDetails.name}</div>
                  <div>Rp{pricePerTicket.toLocaleString('id-ID')}/pax</div>
                  <div className="flex justify-between mt-2">
                    <div>tanggal keberangkatan</div>
                    <div>{tripDetails.departureDate}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Durasi perjalanan</div>
                    <div>{tripDetails.duration}</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <DialogTitle className="font-raleway">Total harga</DialogTitle>
                <div className="font-semibold font-raleway  flex items-center">
                  Rp{totalPrice.toLocaleString('id-ID')}
                  <ChevronDown size={20} />
                </div>
              </div>{' '}
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-[#024C98] rounded-xl"
                  onClick={() => setOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-br rounded-xl from-[#0073E6] to-[#004080] text-white"
                  onClick={handleBooking}
                >
                  Pesan Sekarang
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
