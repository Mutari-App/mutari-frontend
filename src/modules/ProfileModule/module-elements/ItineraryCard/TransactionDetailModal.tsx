import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  GUEST_TITLE_DISPLAY,
  PAYMENT_STATUS,
  PAYMENT_STATUS_COLOR,
  TransactionDetailModalProps,
} from '../../interface'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild className="w-full md:w-1/4 md:self-end">
        <div className="p-[1.5px] flex w-28 items-center bg-gradient-to-r from-[#0073E6] to-[#004080] hover:from-[#0066cc] hover:to-[#003366] rounded-lg group">
          <Button className="h-8 w-full bg-white group-hover:bg-transparent">
            <span className="bg-gradient-to-r from-[#0073E6] to-[#004080] group-hover:text-white text-transparent bg-clip-text flex items-center">
              Lihat Detail
            </span>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="md:max-w-[70%] lg:max-w-[60%] xl:max-w-[40%] max-h-[80dvh] flex flex-col mt-10">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detail Transaksi</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex flex-col gap-6">
          <Card className="rounded-2xl drop-shadow-md text-[#3c3744] font-raleway">
            <CardHeader className="font-semibold grid grid-cols-1 pb-4">
              <h1 className="text-base">{transaction.tour.title}</h1>
              <h1 className="!mt-0 font-normal text-sm">
                ID Pemesanan: {transaction.id}
              </h1>
            </CardHeader>
            <CardContent className="flex flex-col text-sm gap-3.5">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <p>Tanggal Keberangkatan:</p>
                <p className="text-[#024c98] md:text-right font-semibold">
                  {new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <p>Total Pembayaran:</p>
                <p className="text-[#024c98] md:text-right font-semibold">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(transaction.totalPrice)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl drop-shadow-md text-[#3c3744] font-raleway">
            <CardHeader className="font-semibold grid grid-cols-1 pb-2">
              <h1 className="text-base">Detail Partisipan</h1>
            </CardHeader>
            <CardContent className="flex flex-col text-sm gap-3.5">
              {transaction.guests.map((guest, index) => (
                <div key={guest.id} className="flex text-sm">
                  <div className="min-w-4 mr-1 text-right">
                    <p>{`${index + 1}.`}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p>
                      {GUEST_TITLE_DISPLAY[guest.title]} {guest.firstName}{' '}
                      {guest.lastName}
                    </p>
                    <p className="text-xs">
                      Nomor Telepon: {guest.phoneNumber}
                    </p>
                    <p className="text-xs">Alamat Email: {guest.email}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="rounded-2xl drop-shadow-md text-[#3c3744] font-raleway">
            <CardHeader className="font-semibold grid grid-cols-1 pb-2">
              <h1 className="text-base">Detail Pemesanan</h1>
            </CardHeader>
            <CardContent className="flex flex-col text-sm gap-3.5">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <p>Jumlah Tamu:</p>
                <p className="md:text-right">{transaction.quantity} orang</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <p>Total Pembayaran:</p>
                <p className="md:text-right">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(transaction.totalPrice)}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <p>Status Pembayaran:</p>
                <p
                  className={`${PAYMENT_STATUS_COLOR[transaction.paymentStatus]} md:text-right`}
                >
                  {PAYMENT_STATUS[transaction.paymentStatus]}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <p>Tanggal Pemesanan:</p>
                <p className="md:text-right">
                  {new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl drop-shadow-md text-[#3c3744] font-raleway">
            <CardHeader className="font-semibold grid grid-cols-1 pb-2">
              <h1 className="text-base">Kebijakan Pengembalian</h1>
            </CardHeader>
            <CardContent className="flex flex-col text-xs gap-3.5">
              <p>
                Penjadwalan ulang hanya dapat dilakukan 1 (satu) kali dan perlu
                dikonfirmasi terlebih dahulu sesuai dengan ketersediaan Travel
                Assistance. Silakan hubungi Customer Service untuk penjadwalan
                ulang.
              </p>
              <p className="font-semibold">Kontak kami: support@mutari.id</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TransactionDetailModal
