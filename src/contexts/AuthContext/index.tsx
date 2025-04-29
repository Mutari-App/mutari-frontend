'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { setCookie } from 'cookies-next/client'
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
import { customFetch, customFetchBody } from '@/utils/newCustomFetch'
import { deleteCookie, getCookie } from 'cookies-next'
import { Loader2 } from 'lucide-react'

const AuthContext = createContext({} as AuthContextInterface)

export const useAuthContext = () => useContext(AuthContext)

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  userResponse,
  children,
}) => {
  const launchingDate = new Date(
    process.env.NEXT_PUBLIC_LAUNCHING_DATE || '2025-01-22T00:00:00'
  )
  const nowDate = new Date()
  const isLaunching = nowDate > launchingDate

  const [user, setUser] = useState<null | User>(
    isLaunching
      ? (userResponse as UserResponseInterface).user
      : (userResponse as User)
  )
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    isLaunching
      ? !!(userResponse as UserResponseInterface).user
      : !!(userResponse as User)
  )
  const [loadingRefreshToken, setLoadingRefreshToken] = useState<boolean>(
    isLaunching
      ? (userResponse as UserResponseInterface).statusCode === 401
      : false
  )
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
        '/pre-register/referral-code'
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
      const userResponse = await customFetch<UserResponseInterface>('/auth/me')
      if (userResponse.statusCode === 200) {
        setIsAuthenticated(true)
        setUser(userResponse.user)
        return response
      } else {
        throw new Error(userResponse.message)
      }
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
      credentials: 'include',
    })
    setIsAuthenticated(false)
    setUser(null)
    await deleteCookie('accessToken')
    await deleteCookie('refreshToken')
    return response
  }

  const getMe = async () => {
    const refreshToken = getCookie('refreshToken')

    if (
      (userResponse as UserResponseInterface).statusCode === 401 &&
      !!refreshToken
    ) {
      try {
        setLoadingRefreshToken(true)
        const response = await customFetch<UserResponseInterface>('/auth/me')

        if (response.statusCode === 200) {
          setIsAuthenticated(true)
          setUser(response.user)
          router.refresh()
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      } catch (err) {
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoadingRefreshToken(false)
      }
    }
    setLoadingRefreshToken(false)
  }

  useEffect(() => {
    if (isLaunching) {
      void getMe()
    } else {
      setLoadingRefreshToken(true)

      const accessToken = getCookie('AT')
      setIsAuthenticated(!!accessToken)
      setLoadingRefreshToken(false)
    }
  }, [])

  useEffect(() => {
    if (
      !isLaunching &&
      (!developmentLock.current || process.env.NODE_ENV === 'production')
    ) {
      if (searchParams.toString().includes('ticket') && !!fullUrl) {
        const ticket = searchParams.get('ticket')
        toast.promise(validate({ ticket: ticket! }), {
          loading: 'Logging in...',
          success: () => {
            router.push('/')
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
    <AuthContext.Provider value={contextValue}>
      {loadingRefreshToken ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin w-6 h-6 mr-2" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}
