'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { HERO_IMAGES } from '../constant'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsDownIcon } from 'lucide-react'
import Link from 'next/link'
import { getImage } from '@/utils/getImage'
import { useAuthContext } from '@/contexts/AuthContext'

export const Header: React.FC = () => {
  const { isAuthenticated } = useAuthContext()
  const launchingDate = new Date(
    process.env.NEXT_PUBLIC_LAUNCHING_DATE || '2025-01-22T00:00:00'
  )
  const nowDate = new Date()
  const isLaunching = nowDate > launchingDate

  const carouselRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const thumbnailRef = useRef<HTMLDivElement>(null)
  const [autoNextTimeout, setAutoNextTimeout] = useState<NodeJS.Timeout | null>(
    null
  )
  const [resetClassTimeout, setResetClassTimeout] =
    useState<NodeJS.Timeout | null>(null)
  const TIME_RUNNING = 1000
  const TIME_AUTO_NEXT = 5000

  const showSlider = (type: 'prev' | 'next') => {
    if (!carouselRef.current || !sliderRef.current || !thumbnailRef.current)
      return

    const sliderItems =
      sliderRef.current.querySelectorAll<HTMLDivElement>('.item')
    const thumbnailItems =
      thumbnailRef.current.querySelectorAll<HTMLDivElement>('.item')

    if (type === 'next') {
      sliderRef.current.appendChild(sliderItems[0])
      thumbnailRef.current.appendChild(thumbnailItems[0])
      carouselRef.current.classList.add('next')
    } else {
      sliderRef.current.prepend(sliderItems[sliderItems.length - 1])
      thumbnailRef.current.prepend(thumbnailItems[thumbnailItems.length - 1])
      carouselRef.current.classList.add('prev')
    }

    if (resetClassTimeout) clearTimeout(resetClassTimeout)
    setResetClassTimeout(
      setTimeout(() => {
        carouselRef.current?.classList.remove('next', 'prev')
      }, TIME_RUNNING)
    )

    if (autoNextTimeout) clearTimeout(autoNextTimeout)
    setAutoNextTimeout(
      setTimeout(() => {
        showSlider('next')
      }, TIME_AUTO_NEXT)
    )
  }

  useEffect(() => {
    if (thumbnailRef.current) {
      const thumbnailItems =
        thumbnailRef.current.querySelectorAll<HTMLDivElement>('.item')
      if (thumbnailItems.length > 0) {
        thumbnailRef.current.appendChild(thumbnailItems[0])
      }
    }

    setAutoNextTimeout(
      setTimeout(() => {
        showSlider('next')
      }, TIME_AUTO_NEXT)
    )

    return () => {
      if (autoNextTimeout) clearTimeout(autoNextTimeout)
      if (resetClassTimeout) clearTimeout(resetClassTimeout)
    }
  }, [])

  return (
    <header
      id="hero"
      className="carousel mb-10 sm:mb-12 md:mb-14 lg:mb-24 xl:mb-32 h-screen w-screen overflow-hidden relative"
      ref={carouselRef}
    >
      <div className="list" ref={sliderRef}>
        {HERO_IMAGES.map((item, index) => (
          <div key={index} className={`item absolute inset-0 z-10`}>
            <Image
              src={getImage(item.imgName)}
              alt={item.name}
              width={720}
              height={720}
              className="w-full h-full object-cover brightness-50 pointer-events-none"
            />
            <div
              className="content absolute top-[20%] w-[1140px] max-w-[80%] left-[10%] 
            text-white [text-shadow:_0_2px_0_rgb(0_0_0_/40%)] font-poppins"
            >
              <h1 className="hook">
                <p className="text-[2em] md:text-[3.2em]">
                  Rencanakan Perjalanan Sekali Klik.
                </p>
                <p className="text-[1em] font-normal">Mulai jelajahi</p>
              </h1>
              <div className="name font-semibold text-[20px] md:text-[2em] delay-300 text-white font-raleway">
                {item.name}
              </div>
              <div className="city font-raleway text-xs">{item.city}</div>
              <Link href={isLaunching ? '/register' : '#praregistrasi'}>
                <Button className="flex md:hidden text-xs rounded-[150px] mt-5 bg-white text-[#0059B3] w-fit px-4 py-2 gap-3 hover:bg-[#FFFB]">
                  <ChevronsDownIcon />
                  {isLaunching
                    ? 'Registrasi Sekarang!'
                    : 'Pra-Registrasi Sekarang!'}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div
        className="thumbnail absolute bottom-[80px] md:bottom-[100px] left-1/2 w-max z-[100] flex gap-5"
        ref={thumbnailRef}
      >
        {HERO_IMAGES.map((item, index) => (
          <div
            key={index}
            className="item relative w-[200px] h-[150px] flex-shrink-0"
          >
            <Image
              src={getImage(item.imgName)}
              alt={item.name}
              width={720}
              height={720}
              className="w-full h-full object-cover rounded-2xl pointer-events-none"
            />
            <div className="content absolute bottom-0 p-2 text-white bg-black/40 w-full rounded-b-2xl">
              <div className="title font-bold text-sm">{item.name}</div>
              <div className="city text-[10px]">{item.city}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5 absolute top-[75%] left-[10%] w-[300px] max-w-[30%] z-40">
        {isAuthenticated && isLaunching ? (
          <></>
        ) : (
          <Link href={isLaunching ? '/register' : '#praregistrasi'}>
            <Button className="hidden md:flex rounded-[150px] bg-white text-[#0059B3] w-fit px-4 py-2 gap-3 hover:bg-[#FFFB]">
              <ChevronsDownIcon />
              {isLaunching
                ? 'Registrasi Sekarang!'
                : 'Pra-Registrasi Sekarang!'}
            </Button>
          </Link>
        )}
        <div className="arrows flex gap-5 items-center">
          <Button
            onClick={() => showSlider('prev')}
            id="prev"
            className="w-10 h-10 rounded-full bg-[#EEE4] text-white hover:bg-[#EEE] hover:text-[#555] duration-500"
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={() => showSlider('next')}
            id="next"
            className="w-10 h-10 rounded-full bg-[#EEE4] text-white hover:bg-[#EEE] hover:text-[#555] duration-500"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="time absolute top-0 left-0 w-[0%] h-1 bg-blue-500 z-[1000]"></div>
      <div className="bg-gradient-to-t from-white via-white/30 to-white/0 absolute left-0 bottom-0 h-[10%] z-[1001] w-full"></div>
    </header>
  )
}
