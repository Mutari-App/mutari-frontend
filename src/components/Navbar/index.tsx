'use client'

import React, { useEffect, useState } from 'react'
import { NavigationMenu } from '../ui/navigation-menu'
import Image from 'next/image'
import { getImage } from '@/utils/getImage'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { customFetch } from '@/utils/customFetch'

export const Navbar: React.FC = () => {
  const pathname = usePathname() // Get current route path

  const [isScrolledToScreen, setIsScrolledToScreen] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= window.innerHeight) {
        setIsScrolledToScreen(true)
      } else {
        setIsScrolledToScreen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const [isValidItinerary, setIsValidItinerary] = useState<boolean | null>(null)
  useEffect(() => {
    void (async () => {
      const pathnameParts = pathname.split('/')
      const itineraryId = pathnameParts[2]

      if (!itineraryId) return

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
    <NavigationMenu
      className={`p-4 fixed bg-transparent max-w-full w-full z-50 transition-colors duration-300 ${
        pathname == '/' && isScrolledToScreen
          ? 'bg-[#0059B3] shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto w-full container flex justify-between   items-center">
        <Link
          href={'/#hero'}
          className="flex items-end gap-3 hover:cursor-pointer"
        >
          <Image
            src={getImage('logo-white.png')}
            alt="Mutari Logo"
            width={150}
            height={50}
            className="h-12 w-auto z-30"
          />
          <span className="text-white font-hammersmithOne text-[30px]">
            MUTARI
          </span>
        </Link>
        {/* <NavigationMenuList className="flex space-x-4">
          <NavigationMenuItem>
            <NavigationMenuLink href="/" className="">
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about" className="">
              Tentang
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/contact" className="">
              Kontak
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList> */}
      </div>
    </NavigationMenu>
  )
}
