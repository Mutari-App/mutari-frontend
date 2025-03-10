'use client'

import { RegisterContextProvider } from './contexts/RegisterContext'
import { JoinUsSection } from './sections/JoinUsSection'
import { RegisterFormHeader } from './sections/RegisterFormHeader'
import { RegisterFormSection } from './sections/RegisterFormSection'
import { getImage } from '@/utils/getImage'
import Image from 'next/image'

export default function RegisterModule() {
  return (
    <div className="relative">
      <Image
        src={getImage('auth_bg.png')}
        alt="Section Background"
        fill
        className="absolute inset-0 object-cover z-0"
      />

      <section className="flex flex-row relative">
        <JoinUsSection />
        <div className="bg-white min-w-[50%] max-w-[50%] flex flex-col items-center justify-center gap-10 p-[2%]">
          <RegisterFormHeader />
          <RegisterContextProvider>
            <RegisterFormSection />
          </RegisterContextProvider>
        </div>
      </section>
    </div>
  )
}
