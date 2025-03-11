'use client'

import { getImage } from '@/utils/getImage'
import Image from 'next/image'
import { JoinUsSection } from '../RegisterModule/sections/JoinUsSection'
import { RegisterFormHeader } from '../RegisterModule/sections/RegisterFormHeader'
import { LoginForm } from './module-elements/LoginForm'

export default function LoginModule() {
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
          <LoginForm />
        </div>
      </section>
    </div>
  )
}
