'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { getCookie, setCookie, getCookies } from 'cookies-next/client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useBaseUrlWithPath } from '@/hooks/useBaseUrlWithPath'
import {
  UserResponseInterface,
  type AuthContextInterface,
  type AuthContextProviderProps,
  type User,
  type ValidateResponse,
} from './interface'
import { customFetch, customFetchBody } from '@/utils/customFetch'

const AuthContext = createContext({} as AuthContextInterface)

export const useAuthContext = () => useContext(AuthContext)

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  user: userFromServer,
  children,
}) => {
  const launchingDate = new Date(
    process.env.NEXT_PUBLIC_LAUNCHING_DATE || '2025-01-22T00:00:00'
  )
  const nowDate = new Date()
  const isLaunching = nowDate > launchingDate

  const [user, setUser] = useState<null | User>(userFromServer)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const developmentLock = useRef(false)
  const fullUrl = useBaseUrlWithPath()
  const pathname = usePathname()

  const validate = async ({ ticket }: { ticket: string }) => {
    try {
      const response = await customFetch<ValidateResponse>(
        `/pre-register/login/validate/${ticket}`,
        { method: 'POST' }
      )

      if (response.statusCode !== 200) throw new Error(response.message)

      setCookie('AT', response.accessToken)
      setIsAuthenticated(true)
      const responseUser = await customFetch<UserResponseInterface>(
        '/pre-register/referral-code',
        { isAuthorized: true }
      )

      if (responseUser.statusCode !== 200) throw new Error(responseUser.message)

      setUser(responseUser.user)
      router.replace(pathname)
      router.refresh()
      return response
    } catch (e) {
      setUser(null)
      setIsAuthenticated(false)
      router.replace(pathname)
      router.refresh()
      if (e instanceof Error) throw new Error(e.message)
      throw new Error('Unexpected error')
    }
  }

  const login = async (body: { email: string; password: string }) => {
    const response = await customFetch('/auth/login', {
      method: 'POST',
      credentials: 'include',
      body: customFetchBody(body),
    })

    if (response.statusCode === 200) {
      setIsAuthenticated(true)
      return response
    } else {
      throw new Error(response.message)
    }
  }

  const preRegistLogin = async ({ email }: { email: string }) => {
    const response = await customFetch('/pre-register/login', {
      method: 'POST',
      body: customFetchBody({ email }),
    })

    if (response.statusCode === 200) {
      return response
    } else {
      throw new Error(response.message)
    }
  }

  const logout = async () => {
    const response = await customFetch('/auth/logout', {
      method: 'POST',
    })
    return response
  }

  const getMe = async () => {
    try {
      // TODO: change this endpoint to a more proper protected endpoint
      const response = await customFetch('/itineraries/me/completed')

      if (response.statusCode === 200) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (err) {
      setIsAuthenticated(false)
    }
  }

  useEffect(() => {
    if (isLaunching) {
      void getMe()
    } else {
      const accessToken = getCookie('AT')
      setIsAuthenticated(!!accessToken)
    }

    if (
      !isLaunching &&
      (!developmentLock.current || process.env.NODE_ENV === 'production')
    ) {
      if (searchParams.toString().includes('ticket') && !!fullUrl) {
        const ticket = searchParams.get('ticket')
        toast.promise(validate({ ticket: ticket! }), {
          loading: 'Logging in...',
          success: () => {
            router.refresh()
            return 'Login berhasil!'
          },
          error: (err: Error) => `Oops. Login gagal! ${err.message}`,
        })
      }
    }

    return () => {
      if (process.env.NODE_ENV !== 'production' && !!fullUrl) {
        developmentLock.current = true
      }
    }
  }, [searchParams, fullUrl])

  const contextValue = {
    user,
    isAuthenticated,
    setIsAuthenticated,
    validate,
    preRegistLogin,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
