import { ChevronsDownIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Header: React.FC = () => {
  return (
    <header className="max-h-screen overflow-hidden relative">
      <Image
        src={'/images/hero_mutari.png'}
        alt="Hero Image"
        width={720}
        height={720}
        className="w-full object-cover -translate-y-36 z-10"
      />
      <div
        className="w-full absolute bg-black/30 min-h-screen top-0 left-0 z-20 flex justify-center items-center text-white
      flex-col gap-5"
      >
        <div className="flex flex-col text-center">
          <p className="text-[32px] font-light">Discover</p>
          <h1 className="font-bold text-[125px]">INDONESIA</h1>
        </div>
        <p>Candi Prambanan, Indonesia</p>
        <Link
          href={'/#about'}
          className="flex font-semibold animate-bounce call-to-action"
        >
          <ChevronsDownIcon />
          Pre-Register Sekarang!
        </Link>
      </div>
    </header>
  )
}
