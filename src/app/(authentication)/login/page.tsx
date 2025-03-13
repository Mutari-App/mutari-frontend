import LoginModule from '@/modules/LoginModule'
import type { Metadata } from 'next'

export function generateMetadata(): Metadata {
  return {
    title: 'Login',
  }
}

export default function Home() {
  return <LoginModule />
}
