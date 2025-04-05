'use client'

import { customFetch } from '@/utils/customFetch'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfileModule() {
  const router = useRouter()
  // Contoh pemanggilan endpoint protected pada Client Side
  const getMe = async () => {
    const response = await customFetch('/auth/me')
    if (response.statusCode === 401) {
      router.push('/login')
    }
    console.log('clientSide: ', response)
  }

  useEffect(() => {
    void getMe()
  }, [])
  return <></>
}
