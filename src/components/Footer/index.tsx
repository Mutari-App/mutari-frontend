'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Mail } from 'lucide-react'
import { getImage } from '@/utils/getImage'
import { Instagram } from '@/icons/Instagram'
import { Twitter } from '@/icons/Twitter'
import { usePathname } from 'next/navigation'
import { customFetch } from '@/utils/customFetch'

export const Footer: React.FC = () => {
  const pathname = usePathname()
  const [isValidItinerary, setIsValidItinerary] = useState<boolean | null>(null)

  useEffect(() => {
    void (async () => {
      const pathnameParts = pathname.split('/')
      const itineraryId = pathnameParts[2]

      if (!itineraryId || itineraryId === 'create') return

      try {
        const res = await customFetch<{ id: string }>(
          `/itineraries/${itineraryId}`
        )
        setIsValidItinerary(res.statusCode === 200)
      } catch {
        setIsValidItinerary(false)
      }
    })()
  }, [pathname])

  if (pathname === '/itinerary/create' || isValidItinerary) {
    return null
  }

  return (
    <section className="flex justify-center items-center relative bg-[#0059B3] py-8 md:py-12 text-white">
      <div className="relative max-w-screen-xl mx-auto flex gap-4 justify-center">
        <Image
          src={getImage('logo-white-shadow.png')}
          alt="Mutari Logo"
          width={1000}
          height={1000}
          className="object-contain w-28 md:w-40"
        />
        <div className="flex flex-col gap-2 justify-center">
          <p className="text-lg md:text-2xl font-semibold drop-shadow-lg">
            Kontak kami
          </p>
          <a
            href="https://instagram.com/mutari.id"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:underline transition-colors"
          >
            <Instagram className="w-4 h-4 md:w-6 md:h-6 drop-shadow-lg" />
            <span className="text-sm md:text-xl drop-shadow-lg">
              @mutari.id
            </span>
          </a>
          <a
            href="https://x.com/mutariindonesia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:underline transition-colors"
          >
            <Twitter className="w-4 h-4 md:w-6 md:h-6 drop-shadow-lg" />
            <span className="text-sm md:text-xl drop-shadow-lg">
              @mutariindonesia
            </span>
          </a>
          <a
            href="mailto:support@mutari.id"
            className="flex items-center space-x-2 hover:underline transition-colors"
          >
            <Mail className="w-4 h-4 md:w-6 md:h-6 drop-shadow-lg" />
            <span className="text-sm md:text-xl drop-shadow-lg">
              support@mutari.id
            </span>
          </a>
        </div>
      </div>
      <p className="absolute bottom-3 md:bottom-5 text-xs">
        © 2025 Mutari. Semua hak dilindungi undang-undang
      </p>
    </section>
  )
}
