import Image from 'next/image'
import React from 'react'

export const AboutSection: React.FC = () => {
  return (
    <section className="min-h-screen w-full flex justify-center items-center">
      <div
        className="box-content w-4/5 h-[300px] p-4 mx-auto bg-white shadow-md space-y-2 border rounded-md border-gray-300 flex justify-between gap-3"
        style={{ borderColor: '#0073E6' }}
      >
        <div className="w-full md:w-1/3 relative">
          <Image
            src={'/img_about.png'}
            alt="About"
            width={720}
            height={480}
            className="w-full shadow-md -mt-12 md:-mt-16 md:-ml-8 absolute md:relative"
          />
        </div>
        <div className="w-full md:w-3/5 text-center mr-10 md:text-center space-y-4">
          <h2 className="text-3xl font-bold text-blue-600">ABOUT US</h2>
          <p className="text-blue-600 text-lg">
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
          src={'/logo-background.png'}
          alt="Icon"
          width={80}
          height={80}
          className="absolute bottom-0 right-0 w-[80px] md:w-[80px] mb-4 mr-12"
        />
      </div>
    </section>
  )
}
