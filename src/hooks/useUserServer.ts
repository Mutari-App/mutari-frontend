import { type UserResponseInterface } from '../contexts/AuthContext/interface'
import { customFetch } from '../utils/newCustomFetch'

export default async function useUserServer() {
  try {
    const response = await customFetch<UserResponseInterface>('/auth/me')
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
}
