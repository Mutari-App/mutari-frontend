import { getImage } from '@/utils/getImage'
import Image from 'next/image'
import React from 'react'

export const CreateItinerarySection: React.FC = () => {
  return (
    <section className="container mx-auto px-2 flex text-center flex-col items-center">
      <h2 className="text-2xl text-[#3C3744] sm:text-3xl  md:text-4xl font-semibold text-center pb-2">
        Buat Itinerary
      </h2>
      <p className="font-light pb-6 text-xs sm:text-sm md:text-lg">
        Susun rencana perjalananmu bersama Mutari! <br />
        Jelajahi Indonesia dengan menyenangkan
      </p>
      <div className="w-full relative max-w-screen-lg ">
        <div className="absolute top-0 left-0 -translate-y-1/2 w-full aspect-[3]">
          <Image
            src={getImage('landing-page-itinerary-radial-circle.png')}
            fill
            className="object-contain"
            alt="Radial Background"
          />
        </div>
        <div className="relative w-full h-full overflow-hidden border-[3px]  border-[#bdd5ec] rounded-lg md:rounded-2xl bg-white/20 backdrop-blur-sm drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)]">
          <div className="absolute bg-gradient-to-br from-[#ADD4FC] via-[#0E7DED] to-[#ADD4FC]  w-full h-full opacity-30" />
          <div className="w-full h-full px-3 md:px-8 pb-6 md:pb-16 pt-2 md:pt-4 flex flex-col gap-2 md:gap-4">
            <div className="flex gap-1 md:gap-2 relative">
              <div className="w-2 h-2 md:w-4 md:h-4 rounded-full bg-red-500" />
              <div className="w-2 h-2 md:w-4 md:h-4 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 md:w-4 md:h-4 rounded-full bg-green-500" />
            </div>
            <div className="relative aspect-[3/2] w-full h-full overflow-hidden rounded-lg md:rounded-2xl">
              <Image
                src={getImage('landing-demo-screen.png')}
                fill
                className="object-cover"
                alt="Create Itinerary Screen"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
