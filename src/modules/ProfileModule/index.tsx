'use client'

import { customFetch } from '@/utils/customFetch'
import { useEffect } from 'react'

export default function ProfileModule() {
  // Contoh pemanggilan endpoint protected pada Client Side
  const getMe = async () => {
    const response = await customFetch('/auth/me', { credentials: 'include' })
    console.log('clientSide: ', response)
  }

  useEffect(() => {
    void getMe()
  }, [])
  return <></>
}
