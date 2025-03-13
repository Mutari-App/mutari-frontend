import { cookies } from 'next/headers'
import { type UserResponseInterface } from '../contexts/AuthContext/interface'
import { customFetch } from '../utils/customFetch'
import { getCookie } from 'cookies-next/server'

export default async function useUserServer() {
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
