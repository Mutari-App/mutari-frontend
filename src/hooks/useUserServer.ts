import { cookies } from 'next/headers'
import {
  type User,
  type UserResponseInterface,
} from '../contexts/AuthContext/interface'
import { customFetch } from '../utils/customFetch'
import { getCookie } from 'cookies-next'

export default async function useUserServer() {
  const AT = getCookie('AT', { cookies })
  if (!AT) {
    return null
  }

  const response = await customFetch<UserResponseInterface>(
    '/auth/user',
    { isAuthorized: true },
    cookies
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { code, success, message, ...user } = response

  if (code !== 200) {
    return null
  }
  return user as User
}
