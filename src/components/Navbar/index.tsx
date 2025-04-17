'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../ui/navigation-menu'
import Image from 'next/image'
import { getImage } from '@/utils/getImage'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { customFetch } from '@/utils/customFetch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { useAuthContext } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export const Navbar: React.FC = () => {
  const launchingDate = new Date(
    process.env.NEXT_PUBLIC_LAUNCHING_DATE || '2025-01-22T00:00:00'
  )
  const nowDate = new Date()
  const isLaunching = nowDate > launchingDate
  const { isAuthenticated, logout } = useAuthContext()
  const pathname = usePathname() // Get current route path
  const router = useRouter()

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

  const handleLogout = async () => {
    try {
      const response = await logout()
      if (response.statusCode !== 200) {
        throw new Error('Gagal logout!')
      }
      router.push('/login')
      toast.success('Logout berhasil!')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Terjadi kesalahan tidak terduga.')
      }
    }
  }

  return (
    <NavigationMenu
      className={`p-4 fixed bg-transparent max-w-full w-full z-[101] transition-colors duration-300 ${
        pathname == '/' && isScrolledToScreen
          ? 'bg-[#0059B3] shadow-md'
          : 'bg-transparent'
      } ${pathname != '/' && 'bg-white shadow-md'}`}
    >
      <div className="mx-auto w-full container flex justify-between items-center">
        <div className="flex justify-start gap-5 items-center">
          <Link
            href={'/#hero'}
            className="flex items-end gap-3 hover:cursor-pointer"
          >
            <Image
              src={getImage(
                `${pathname == '/' ? 'logo-white.png' : 'logo-no-background.png'}`
              )}
              alt="Mutari Logo"
              width={150}
              height={50}
              className="h-12 w-auto z-30"
            />
            <span
              className={`${pathname == '/' ? 'text-white' : 'text-[#0059B3]'} font-hammersmithOne text-[30px]`}
            >
              MUTARI
            </span>
          </Link>
          <NavigationMenuList
            className={`flex space-x-4 ${pathname == '/' ? 'text-white' : 'text-black'}`}
          >
            <NavigationMenuItem>
              <NavigationMenuLink href="/itinerary" className="hover:underline">
                Itinerary
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </div>

        {isLaunching &&
          (isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none ">
                <div className="rounded-full overflow-hidden hover:opacity-80 transition-opacity">
                  <Image
                    src="/images/profile-placeholder.png"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="h-10 w-10 object-cover"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 p-2 relative z-[102]"
              >
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center gap-2 text-red-500 hover:text-red-700 focus:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button
                className={`transition-colors px-6 ${
                  pathname === '/'
                    ? 'bg-white text-[#0059B3] hover:bg-gray-100'
                    : 'bg-[#0059B3] text-white hover:bg-[#004C99]'
                }`}
              >
                Masuk
              </Button>
            </Link>
          ))}
      </div>
    </NavigationMenu>
  )
}
