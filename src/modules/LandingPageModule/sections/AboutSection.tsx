import { getImage } from '@/utils/getImage'
import Image from 'next/image'
import React from 'react'

export const AboutSection: React.FC = () => {
  return (
    <section className="w-full sm:mb-8 md:mb-14 lg:mb-24 xl:mb-32 flex justify-center items-center py-10 sm:pb-20 overflow-hidden">
      <div
        className="box-content  max-w-screen-lg relative w-4/5 h-auto min-h-72 px-4 py-6 flex-col md:flex-row xl:py-12 mx-auto bg-white shadow-md  border rounded-md border-gray-300 flex md:justify-evenly items-center gap-3"
        style={{ borderColor: '#0073E6' }}
      >
        <div className="relative w-full h-min md:w-1/3">
          <div className="w-full flex justify-center md:absolute -translate-y-1/3 md:-translate-y-1/2 max-w-sm mx-auto md:max-w-none md:-left-10 scale-110">
            <Image
              src={getImage('img-about.png')}
              alt="About"
              width={720}
              height={600}
              className="w-[90%] md:w-auto aspect-video md:aspect-auto object-cover shadow-md"
            />
          </div>
        </div>
        <div className="w-full md:w-3/5 text-center  mb-6 md:mb-0 -mt-10 md:mt-0 md:mr-6  flex flex-col items-center justify-center relative">
          <h2 className="text-lg sm:text-xl lg:text-3xl font-semibold  text-[#0073E6] mb-6 lg:mb-8">
            Kenalan Lebih Dekat dengan Mutari: Teman Traveling Pintarmu!
          </h2>
          <p className="text-[#0073E6] font-raleway text-xs md:text-base lg:text-lg">
            <strong className="font-semibold">
              Ingin liburan ke Indonesia tapi bingung menyusun rencana
              perjalanan?
            </strong>{' '}
            Mutari hadir sebagai solusi terbaik untuk membuat pengalaman wisata
            Anda lebih mudah dan menyenangkan! Kami menawarkan berbagai fitur
            unggulan yang dirancang khusus untuk membantu mengatasi tantangan
            perjalanan wisatawan.
          </p>
          <br />
          <p className="text-[#0073E6] font-raleway text-xs md:text-base lg:text-lg">
            Bersama Mutari, rencanakan liburan impian Anda ke Indonesia dengan
            lebih praktis dan tanpa ribet!
          </p>
        </div>
        <Image
          src={getImage('logoblue-background.png')}
          alt="Icon"
          width={160}
          height={160}
          className="absolute hidden sm:block translate-x-1/2 translate-y-1/3 bottom-0 right-0 w-[100px] lg:w-[120px]"
        />
      </div>
    </section>
  )
}
