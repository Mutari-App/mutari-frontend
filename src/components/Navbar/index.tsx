import React from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../ui/navigation-menu'
import Image from 'next/image'
import { getImage } from '@/utils/getImage'
import Link from 'next/link'

export const Navbar: React.FC = () => {
  return (
    <NavigationMenu className="p-4 fixed bg-transparent max-w-full z-50">
      <div className="mx-auto w-full container flex justify-between max-w-screen-xl items-center">
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
          <h1 className='text-white font-hammersmithOne text-[30px]'>MUTARI</h1>
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
