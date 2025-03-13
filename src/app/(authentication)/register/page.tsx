import RegisterModule from '@/modules/RegisterModule'
import type { Metadata } from 'next'

export function generateMetadata(): Metadata {
  return {
    title: 'Register',
  }
}

export default function Home() {
  return <RegisterModule />
}
