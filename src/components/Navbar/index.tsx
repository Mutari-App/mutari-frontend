import React from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../ui/navigation-menu'
import Image from 'next/image'

export const Navbar: React.FC = () => {
  return (
    <NavigationMenu className="p-4 fixed bg-transparent max-w-full z-50">
      <div className="mx-auto w-full container flex justify-between max-w-screen-xl items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo-white.png"
            alt="Mutari Logo"
            width={150}
            height={50}
            className="h-12 w-auto z-30"
          />
        </div>
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
