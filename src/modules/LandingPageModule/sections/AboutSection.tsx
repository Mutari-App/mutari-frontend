import { getImage } from '@/utils/getImage'
import Image from 'next/image'
import React from 'react'

export const AboutSection: React.FC = () => {
  return (
    <section className="min-h-screen w-full flex justify-center items-center">
      <div
        className="box-content w-4/5 h-auto min-h-72 p-4 mx-auto bg-white shadow-md space-y-10 border rounded-md border-gray-300 flex justify-between gap-3"
        style={{ borderColor: '#0073E6' }}
      >
        <div className="relative w-full md:w-1/3">
          <div className="w-full flex justify-center md:absolute md:-top-16 md:-left-8">
            <Image
              src={getImage('img-about.png')}
              alt="About"
              width={720}
              height={480}
              className="w-[80%] md:w-auto h-auto shadow-md"
            />
          </div>
        </div>
        <div className="w-full md:w-3/5 text-center mr-10 md:text-center space-y-4">
          <h2 className="text-3xl font-bold text-blue-600">ABOUT US</h2>
          <p className="text-blue-600 text-sm">
            <strong>
              Ingin liburan ke Indonesia tapi bingung menyusun rencana
              perjalanan?
            </strong>
            Mutari hadir sebagai solusi terbaik untuk membuat pengalaman wisata
            Anda lebih mudah dan menyenangkan! Kami menawarkan berbagai fitur
            unggulan yang dirancang khusus untuk membantu mengatasi tantangan
            perjalanan wisatawan.
            <br />
            <br />
            Bersama Mutari, rencanakan liburan impian Anda ke Indonesia dengan
            lebih praktis dan tanpa ribet!
          </p>
        </div>

        <Image
          src={getImage('logoblue-background.png')}
          alt="Icon"
          width={100}
          height={100}
          className="absolute -bottom-0.5 right-10 w-[100px] md:w-[100px]"
        />
      </div>
    </section>
  )
}
