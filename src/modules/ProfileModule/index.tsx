'use client'

import { customFetch } from '@/utils/newCustomFetch'
import { useEffect } from 'react'

export default function ProfileModule() {
  // Contoh pemanggilan endpoint protected pada Client Side
  const getMe = async () => {
    const response = await customFetch('/auth/me')
    console.log('clientSide: ', response)
  }

  useEffect(() => {
    // void getMe()
  }, [])
  return <></>
}
