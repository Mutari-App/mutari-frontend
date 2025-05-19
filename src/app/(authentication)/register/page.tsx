import RegisterModule from '@/modules/RegisterModule'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export function generateMetadata(): Metadata {
  return {
    title: 'Register',
  }
}

export default function Home() {
  const launchingDate = new Date(
    process.env.NEXT_PUBLIC_LAUNCHING_DATE ?? '2025-01-22T00:00:00'
  )
  const nowDate = new Date()
  const isLaunching = nowDate > launchingDate
  return isLaunching ? <RegisterModule /> : notFound()
}
