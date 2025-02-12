import { cookies } from 'next/headers'
import { type UserResponseInterface } from '../contexts/AuthContext/interface'
import { customFetch } from '../utils/customFetch'
import { getCookie } from 'cookies-next'

export default async function useUserServer() {
  const AT = getCookie('AT', { cookies })
  if (!AT) {
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
