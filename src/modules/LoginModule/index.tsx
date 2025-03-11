'use client'

import { getImage } from '@/utils/getImage'
import Image from 'next/image'
import { JoinUsSection } from '../RegisterModule/sections/JoinUsSection'
import { RegisterFormHeader } from '../RegisterModule/sections/RegisterFormHeader'
import { LoginForm } from './module-elements/LoginForm'

export default function LoginModule() {
  return (
    <div className="relative min-h-screen">
      <Image
        src={getImage('auth_bg.png')}
        alt="Section Background"
        fill
        className="absolute inset-0 object-cover z-0"
      />

      <section className="flex min-h-screen flex-row relative">
        <JoinUsSection />
        <div className="bg-white w-full md:w-1/2 flex flex-col items-center  justify-center gap-10 p-[2%]">
          <RegisterFormHeader />
          <LoginForm />
        </div>
      </section>
    </div>
  )
}
