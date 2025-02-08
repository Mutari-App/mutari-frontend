import React from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../ui/navigation-menu'
import Image from 'next/image'
import { getImage } from '@/utils/getImage'

export const Navbar: React.FC = () => {
  return (
    <NavigationMenu className="p-4 shadow-md bg-white max-w-full ">
      <div className="mx-auto container flex justify-between max-w-screen-xl items-center">
        <div className="flex items-center gap-3">
          <Image
            src={getImage(`logo-no-background.png`)}
            alt="Mutari Logo"
            width={150}
            height={50}
            className="h-12 w-auto"
          />
          <span className="text-2xl font-bold tracking-wide text-blue-600 uppercase">
            Mutari
          </span>
        </div>
        <NavigationMenuList className="flex space-x-4">
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
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  )
}
