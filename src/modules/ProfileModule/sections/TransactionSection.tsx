import { Loader } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import {
  type GetTransactionProps,
  type ProfileModuleProps,
  type TransactionProps,
} from '../interface'
import { customFetch } from '@/utils/newCustomFetch'
import { toast } from 'sonner'
import TransactionCard from '../module-elements/ItineraryCard/TransactionCard'
import { useRouter } from 'next/navigation'

export const TransactionSection: React.FC<ProfileModuleProps> = ({
  transactionId,
}) => {
  const router = useRouter()
  const [transactions, setTransactions] = useState<TransactionProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const getTransactions = useCallback(async () => {
    try {
      setLoading(true)
      const response = await customFetch<GetTransactionProps>(
        `/profile/transactions`
      )

      if (response.statusCode !== 200) {
        throw new Error('Terjadi kesalahan saat mengambil data itineraries')
      }

      setTransactions(response.transactions)
    } catch (err: any) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (transactionId) {
      const confirmPayment = async () => {
        try {
          setLoading(true)
          const result = await customFetch(`/tour/${transactionId}/pay`, {
            method: 'PATCH',
          })

          if (result.statusCode !== 200) throw new Error(result.message)

          toast.success('Pembayaran Berhasil')
        } catch (error: any) {
          if (error instanceof Error) {
            toast.error(error.message)
          } else {
            toast.error(
              'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.'
            )
          }
        } finally {
          const url = new URL(window.location.href)
          url.searchParams.delete('transactionId')
          router.push(url.toString())
          setLoading(false)
        }
      }

      void confirmPayment()
    }
  }, [transactionId, router, getTransactions])

  useEffect(() => {
    void getTransactions()
  }, [getTransactions])

  if (loading) {
    return (
      <div className="flex justify-center">
        <Loader className="animate-spin" />
      </div>
    )
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center">
          <Loader className="animate-spin" />
        </div>
      )
    }

    if (transactions.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6 w-full">
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )
    }

    return <p className="italic">Belum ada transaksi</p>
  }

  return (
    <section className="mx-auto pb-6 pt-3 w-full">
      <div className="flex flex-col md:flex-row gap-2  w-full justify-between items-start pb-5">
        <h2 className="font-semibold font-poppins text-xl md:text-2xl">
          Riwayat Transaksi
        </h2>
      </div>
      {renderContent()}
    </section>
  )
}
