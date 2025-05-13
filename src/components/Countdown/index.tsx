'use client'

import React, {
  type ComponentPropsWithoutRef,
  useEffect,
  useState,
} from 'react'
import { type CountdownProps } from './interface'
import { Timer } from 'lucide-react'
import { cn } from '@/lib/utils'

const BlockTime: React.FC<ComponentPropsWithoutRef<'div'> & CountdownProps> = ({
  date,
  type,
  classNameType,
  classNameBlock,
}) => {
  return (
    <div className="flex flex-col items-center ">
      <div
        className={cn(
          'flex justify-center items-center sm:mb-2  w-[48px]  xs:w-[64px] sm:w-[93px]    rounded-xl',
          classNameBlock
        )}
      >
        <span
          className={cn(
            'inline-block font-semibold text-2xl xs:text-[32px] lg:text-[48px] sm:text-[40px] text-white',
            classNameType
          )}
        >
          {date}
        </span>
      </div>
      <span
        className={cn(
          'inline-block font-semibold  text-white  text-[9px] xs:text-xs sm:text-base',
          classNameType
        )}
      >
        {type}
      </span>
    </div>
  )
}

const DotTime = () => {
  return (
    <div className="flex flex-col gap-3 sm:gap-5 ">
      <div className="w-[3px] h-1 sm:w-1.5 sm:h-2  bg-white"></div>
      <div className="w-[3px] h-1 sm:w-1.5 sm:h-2  bg-white"></div>
    </div>
  )
}

const Countdown = ({
  targetDate,
  displayDate = false,
  classNameType,
  classNameBlock,
  onComplete,
}: {
  targetDate: Date
  displayDate?: boolean
  classNameType?: string
  classNameBlock?: string
  onComplete?: () => void
}) => {
  const defaultRemainingTime = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }

  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime)
  const [dateTime, setDateTime] = useState({
    date: '',
    time: '',
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const deadlineDate = targetDate.getTime()
      const now = new Date().getTime()
      const distance = deadlineDate - now

      const days = Math.floor(distance / (24 * 60 * 60 * 1000))
      const hours = Math.floor(
        (distance % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor((distance % (60 * 60 * 1000)) / (1000 * 60))
      const seconds = Math.floor((distance % (60 * 1000)) / 1000)

      if (distance < 0) {
        setRemainingTime({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
        if (onComplete) {
          onComplete()
        }
      } else {
        setRemainingTime({
          days,
          hours,
          minutes,
          seconds,
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate, displayDate, onComplete])

  useEffect(() => {
    const date = targetDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    const time = targetDate
      .toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      })
      .replace('.', ':')

    setDateTime({
      date,
      time,
    })
  }, [targetDate])

  return (
    <div className="relative font-raleway flex shadow-[0_0_0_0.5px_rgba(255,255,255)] bg-gradient-to-br  from-[#ffffff47] to-[#ffffff00] overflow-hidden rounded-xl sm:rounded-2xl px-4 py-2 sm:py-4 flex-col items-center gap-2">
      <div className="absolute top-0 left-0 w-full h-full bg-black/15" />
      <div className="relative flex items-center gap-1 sm:gap-3">
        <BlockTime
          classNameBlock={classNameBlock}
          classNameType={classNameType}
          type={remainingTime.days != 0 ? 'Hari' : 'Jam'}
          date={
            remainingTime.days != 0
              ? remainingTime.days.toString().padStart(2, '0')
              : remainingTime.hours.toString().padStart(2, '0')
          }
        />
        <DotTime />
        <BlockTime
          classNameBlock={classNameBlock}
          classNameType={classNameType}
          type={remainingTime.days != 0 ? 'Jam' : 'Menit'}
          date={
            remainingTime.days != 0
              ? remainingTime.hours.toString().padStart(2, '0')
              : remainingTime.minutes.toString().padStart(2, '0')
          }
        />
        <DotTime />
        <BlockTime
          classNameBlock={classNameBlock}
          classNameType={classNameType}
          type={remainingTime.days != 0 ? 'Menit' : 'Detik'}
          date={
            remainingTime.days != 0
              ? remainingTime.minutes.toString().padStart(2, '0')
              : remainingTime.seconds.toString().padStart(2, '0')
          }
        />
      </div>
      {displayDate && (
        <div className="flex items-center gap-1 sm:gap-2">
          <Timer
            className={cn(
              'w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] text-[#0E191C] ',
              classNameType
            )}
          />
          <span
            className={cn(
              'inline-block text-[9px] xs:text-xs sm:text-base font-bold pt-[2px] sm:pt-0 text-[#0E191C] ',
              classNameType
            )}
          >{`${dateTime.date}, ${dateTime.time}`}</span>
        </div>
      )}
    </div>
  )
}

export default Countdown
