import { type UserResponseInterface } from '../contexts/AuthContext/interface'
import { customFetch as newCustomFetch } from '../utils/newCustomFetch'
import { cookies } from 'next/headers'
import { customFetch } from '../utils/customFetch'
import { getCookie } from 'cookies-next/server'

export default async function getUser() {
  const launchingDate = new Date(
    process.env.NEXT_PUBLIC_LAUNCHING_DATE ?? '2025-01-22T00:00:00'
  )
  const nowDate = new Date()
  const isLaunching = nowDate > launchingDate
  if (isLaunching) {
    try {
      const response = await newCustomFetch<UserResponseInterface>('/auth/me')
      if (response.statusCode !== 200) {
        return { statusCode: response.statusCode, user: null }
      }
      return { statusCode: response.statusCode, user: response.user }
    } catch (err) {
      if ((err as Error).message === 'TokenExpiredOnServer') {
        return { statusCode: 401, user: null }
      }
      return { statusCode: 500, user: null }
    }
  } else {
    const accessToken = await getCookie('AT', { cookies })
    if (!accessToken) {
      return null
    }

    const response = await customFetch<UserResponseInterface>(
      '/pre-register/referral-code',
      { isAuthorized: true },
      cookies
    )

    if (response.statusCode !== 200) {
      return null
    }
    return response.user
  }
}
