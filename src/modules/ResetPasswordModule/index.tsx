'use client'

import { ResetPasswordContextProvider } from './contexts/ResetPasswordContext'
import { ForgotPasswordSection } from './sections/ForgotPasswordSection'
import { ResetPasswordFormHeader } from './sections/ResetPasswordFormHeader'
import { ResetPasswordFormSection } from './sections/ResetPasswordFormSection'
import { getImage } from '@/utils/getImage'
import Image from 'next/image'

export default function ResetPasswordModule() {
  return (
    <div className="relative">
      <Image
        src={getImage('auth_bg.png')}
        alt="Section Background"
        fill
        className="hidden lg:flex absolute inset-0 object-cover z-0"
      />

      <section className="flex flex-row relative items-center justify-center">
        <ForgotPasswordSection />
        <div className="bg-white min-w-[50%] min-h-screen flex flex-col items-center justify-center gap-10  p-[10%] md:p-[2%]">
          <ResetPasswordFormHeader />
          <ResetPasswordContextProvider>
            <ResetPasswordFormSection />
          </ResetPasswordContextProvider>
        </div>
      </section>
    </div>
  )
}
