import { cookies } from 'next/headers'
import { type UserResponseInterface } from '../contexts/AuthContext/interface'
import { customFetch } from '../utils/customFetch'
import { getCookie } from 'cookies-next/server'

export default async function useUserServer() {
  const AT = await getCookie('accessToken', { cookies })
  if (!AT) {
    return null
  }

  const response = await customFetch<UserResponseInterface>(
    '/pre-register/referral-code'
  )

  if (response.statusCode !== 200) {
    return null
  }
  return response.user
}
