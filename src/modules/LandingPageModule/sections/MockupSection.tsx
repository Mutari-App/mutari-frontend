import { getImage } from '@/utils/getImage'
import Image from 'next/image'
import React from 'react'

export const MockupSection: React.FC = () => {
  return (
    <section className="relative container max-w-screen-xl mx-auto pt-10 pb-32 px-4 text-white flex flex-col gap-4">
      <h2 className="text-lg text-center text-[#3C3744] block sm:hidden md:text-3xl font-semibold  pb-2">
        Temukan & Booking Trip Impian dalam Sekejap!
      </h2>
      <div className="flex gap-4">
        <div className="relative aspect-[414/696] w-[35%]">
          <Image
            src={getImage('landing-phone-mockup.png')}
            alt="Phone Mockup"
            fill
            className="object-contain"
          />
        </div>
        <div className="w-[65%] text-right flex flex-col gap-4 sm:justify-center">
          <h2 className="text-2xl text-[#3C3744]  md:text-3xl font-semibold hidden sm:block pb-2">
            Temukan & Booking Trip Impian dalam Sekejap!
          </h2>
          <p className="text-black text-xs sm:text-base md:text-lg text-justify sm:text-right">
            Bingung cari paket wisata yang sesuai budget dan keinginanmu? Dengan
            Tour Marketplace, kamu bisa dengan mudah menemukan, membandingkan,
            dan memesan berbagai paket tour dari travel agent terpercaya. Mulai
            dari wisata alam, city tour, hingga pengalaman unik seperti glamping
            atau diving—semua tersedia dalam satu platform!
          </p>
        </div>
      </div>
    </section>
  )
}
