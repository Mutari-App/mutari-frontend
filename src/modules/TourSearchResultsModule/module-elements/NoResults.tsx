import React from 'react'
import { Search, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NoResultsProps {
  query: string
  onReset: () => void
}

const NoResults: React.FC<NoResultsProps> = ({ query, onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">Tidak ada hasil ditemukan</h3>
      <p className="mb-6 max-w-md text-sm text-gray-500">
        {query
          ? `Kami tidak dapat menemukan tur yang cocok dengan "${query}". Coba kata kunci lain atau hapus beberapa filter.`
          : 'Tidak ada itinerary yang cocok dengan filter saat ini. Coba sesuaikan kriteria pencarian Anda.'}
      </p>
      <Button onClick={onReset} variant="outline" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        <span>Reset Pencarian</span>
      </Button>
    </div>
  )
}

export default NoResults
