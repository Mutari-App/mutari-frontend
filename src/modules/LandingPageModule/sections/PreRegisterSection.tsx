'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { getImage } from '@/utils/getImage'
import Countdown from '@/components/Countdown'
import { PreRegisterForm } from '../module-elements/PreRegisterForm'
import { LoginForm } from '../module-elements/LoginForm'
import { useAuthContext } from '@/contexts/AuthContext'
import { ReferralCode } from '../module-elements/ReferralCode'
import { type PreRegisterSectionProps } from '../interface'

export const PreRegisterSection: React.FC<PreRegisterSectionProps> = ({
  count,
}) => {
  const [email, setEmail] = useState<string>('')
  const [isRegisterSuccess, setIsRegisterSuccess] = useState<boolean>(false)
  const [isLoginSuccess, setIsLoginSuccess] = useState<boolean>(false)
  const [isLoginForm, setIsLoginForm] = useState<boolean>()
  const { isAuthenticated, user } = useAuthContext()

  const showLoginForm = () => {
    setIsLoginForm(true)
  }

  const showRegisterForm = () => {
    setIsLoginForm(false)
  }

  return (
    <section
      id={'praregistrasi'}
      className="relative min-h-screen w-screen flex flex-col items-center px-2 sm:px-4 py-4 sm:py-10 md:py-20 text-white"
    >
      <div className="w-screen h-10 bg-gradient-to-b from-white to-transparent absolute z-10 top-0 left-0 " />
      <Image
        src={getImage('pre-register-form-bg.webp')}
        fill
        className="object-cover object-center"
        alt="Form Background"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-[#3C374450] " />
      <div className="flex pt-10 flex-col items-center relative">
        <span className="text-xs sm:text-sm md:text-base pb-3">
          Tunggu apalagi?
        </span>
        <h2 className="text-lg text-white  md:text-3xl font-semibold text-center pb-3">
          Petualangan Baru Menanti!
        </h2>
        <span className="text-sm md:text-lg  text-center pb-3">
          Pra-registrasi sekarang, dapatkan hadiahnya
        </span>

        <Countdown targetDate={new Date('2025-06-15T12:00:00')} />

        <span className=" pt-2 pb-2 sm:pb-4 sm:pt-4 md:pb-6  md:pt-6 text-xs  sm:text-sm md:text-base text-center">
          <strong>{count} pengguna</strong> telah melakukan praregistrasi
        </span>
      </div>

      <div className="w-full max-w-3xl mb-8 relative">
        <div className="overflow-hidden relative bg-gradient-to-br from-[#ffffff47] to-[#ffffff00] shadow-[0_0_0_0.5px_rgba(255,255,255)] rounded-xl sm:rounded-3xl py-6 px-4 sm:px-8 md:px-16">
          <div className="absolute top-0 left-0 w-full h-full bg-black/25" />
          {isAuthenticated ? (
            <ReferralCode user={user!} />
          ) : isLoginForm ? (
            <LoginForm
              email={email}
              setEmail={setEmail}
              isSuccess={isLoginSuccess}
              setIsSuccess={setIsLoginSuccess}
              showRegisterForm={showRegisterForm}
            />
          ) : (
            <PreRegisterForm
              email={email}
              setEmail={setEmail}
              isSuccess={isRegisterSuccess}
              setIsSuccess={setIsRegisterSuccess}
              showLoginForm={showLoginForm}
            />
          )}
        </div>
      </div>
    </section>
  )
}
