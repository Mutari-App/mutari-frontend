import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TransactionCardProps } from '../../interface'
import { Calendar, Earth, User } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import TransactionDetailModal from './TransactionDetailModal'

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const date = new Date(transaction.createdAt).toLocaleDateString('id-ID', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Card className="w-full rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between bg-[#0073e6] rounded-t-2xl py-2.5 h-1/4">
        <div className="flex flex-row items-center gap-3 w-3/5 text-white text-sm font-semibold">
          <Earth size={16} /> {transaction.tour.location}
        </div>
        <p className="!mt-0 text-[#9dbaef] text-right text-sm truncate w-2/5">
          ID: {transaction.id}
        </p>
      </CardHeader>
      <CardContent className="py-5 px-6 flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-full md:w-3/4">
            <h2 className="text-lg font-semibold">{transaction.tour.title}</h2>
            <div className="flex flex-row items-center gap-2 font-roboto">
              <User className="text-[#0073e6]" fill="#0073e6" size={16} />{' '}
              {transaction.quantity} orang
              <Calendar className="text-[#0073e6]" size={16} /> {date}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center">
            <Separator
              className="bg-black my-2 w-full md:h-auto md:w-px md:my-0 md:mx-0 md:self-stretch"
              decorative
            />

            <div className="flex flex-row md:flex-col items-center md:items-start w-full justify-between md:pl-4">
              <p className="font-semibold">Total Harga:</p>
              <p className="font-raleway text-sm font-semibold">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(transaction.totalPrice)}
              </p>
            </div>
          </div>
        </div>
        <TransactionDetailModal transaction={transaction} />
      </CardContent>
    </Card>
  )
}

export default TransactionCard
