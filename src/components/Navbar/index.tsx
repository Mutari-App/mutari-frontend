'use client'
import type React from 'react'
import { useEffect, useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import Image from 'next/image'
import { getImage } from '@/utils/getImage'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Menu, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'

export const Navbar: React.FC = () => {
  const launchingDate = new Date(
    process.env.NEXT_PUBLIC_LAUNCHING_DATE ?? '2025-01-22T00:00:00'
  )
  const nowDate = new Date()
  const isLaunching = nowDate > launchingDate
  const { isAuthenticated, logout, user } = useAuthContext()
  const pathname = usePathname() // Get current route path
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
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

  const isLandingPage = pathname === '/landing-page'

  return (
    <NavigationMenu
      className={`p-4 fixed bg-transparent max-w-full w-full z-50 transition-colors duration-300 ${
        pathname == '/' && isScrolledToScreen
          ? 'bg-[#0059B3] shadow-md'
          : 'bg-transparent'
      } ${!isLandingPage && 'bg-white shadow-md'}`}
    >
      <div className="mx-auto w-full container flex justify-between items-center">
        <div className="flex justify-start gap-2 sm:gap-8 items-center">
          {/* Hamburger menu for mobile */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-transparent focus:bg-transparent"
              >
                <Menu
                  className={`h-6 w-6 ${isLandingPage ? 'text-white' : 'text-[#0059B3]'}`}
                />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <SheetTitle></SheetTitle>
              <div className="flex flex-col gap-6 pt-6">
                <Link
                  href={'/#hero'}
                  className="flex items-end gap-2 hover:cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  <Image
                    src={getImage('logo-no-background.png')}
                    alt="Mutari Logo"
                    width={100}
                    height={50}
                    className="h-8 w-auto"
                  />
                  <span className="text-[#0059B3] font-hammersmithOne text-[20px]">
                    MUTARI
                  </span>
                </Link>
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/"
                    className="hover:text-[#0059B3] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Beranda
                  </Link>
                  <Link
                    href="/itinerary"
                    className="hover:text-[#0059B3] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Itinerary
                  </Link>
                  <Link
                    href="/tour"
                    className="hover:text-[#0059B3] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Tur
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <Link
            href={'/#hero'}
            className="flex items-end gap-2 sm:gap-3 hover:cursor-pointer"
          >
            <Image
              src={getImage(
                `${pathname == '/landing-page' ? 'logo-white.png' : 'logo-no-background.png'}`
              )}
              alt="Mutari Logo"
              width={150}
              height={50}
              className="h-10 sm:h-12 w-auto z-50"
            />
            <span
              className={`${isLandingPage ? 'text-white' : 'text-[#0059B3]'} font-hammersmithOne text-[24px] sm:text-[30px]`}
            >
              MUTARI
            </span>
          </Link>
          {/* Desktop navigation */}
          <NavigationMenuList
            className={`hidden md:flex space-x-8 ${isLandingPage ? 'text-white' : 'text-black'} text-sm sm:text-base`}
          >
            <NavigationMenuItem>
              <NavigationMenuLink href="/" className="hover:underline">
                Beranda
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/itinerary" className="hover:underline">
                Itinerary
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/tour" className="hover:underline">
                Tur
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </div>
        {isLaunching &&
          (isAuthenticated && !!user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none ">
                <div className="rounded-full overflow-hidden hover:opacity-80 transition-opacity">
                  <Image
                    src="/images/profile-placeholder.png"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="h-8 w-8 sm:h-10 sm:w-10 object-cover"
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 p-2 relative z-50"
              >
                <DropdownMenuItem>
                  <Link
                    href={`/profile/${user.id}`}
                    className=" w-full cursor-pointer flex items-center gap-2 text-slate-600 hover:text-slate-700 focus:text-slate-700"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
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
                className={`transition-colors px-4 sm:px-6 py-1 sm:py-2 text-sm sm:text-base ${
                  isLandingPage
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
