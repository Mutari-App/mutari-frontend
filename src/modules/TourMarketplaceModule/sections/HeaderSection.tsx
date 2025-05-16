'use client'

import React from 'react'
import { getImage } from '@/utils/getImage'
import SearchBar from '@/components/SearchBar'
import { useRouter } from 'next/navigation'

const HeaderSection = () => {
  const router = useRouter()
  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/tour/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div
      className="relative py-4 sm:py-8 md:py-14 lg:py-16 bg-cover bg-center w-full"
      style={{
        backgroundImage: `url(${getImage('Header_SRP_Tour.png')})`,
      }}
    >
      <div className="container relative mx-auto flex flex-col items-center justify-center px-4 z-10 pt-20 gap-10 sm:gap-16 md:gap-20 lg:gap-24">
        <SearchBar
          initialValue=""
          onSearch={handleSearch}
          className="flex-grow w-full max-w-xl"
          variant="iconLeft"
          placeholder="Cari Tiket Tur..."
          searchType="tour"
        />
        <div className="text-center text-white space-y-2 md:space-y-4">
          <h1 className="max-[480px]:flex max-[480px]:flex-col text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold">
            <span>Temukan Pesona</span>{' '}
            <span className="bg-gradient-to-b from-[#9DB3D6] to-[#4E9DF0] bg-clip-text text-transparent">
              WILAYAH NUSANTARA
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl">
            Pesan paket tur dengan mudah!
          </p>
        </div>
      </div>
    </div>
  )
}

export default HeaderSection
