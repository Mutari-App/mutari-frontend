'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  AuthContextInterface,
  AuthContextProviderProps,
  User,
} from './interface'
import { getCookie, setCookie } from 'cookies-next/client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useBaseUrlWithPath } from '@/hooks/useBaseUrlWithPath'

const AuthContext = createContext({} as AuthContextInterface)

export const useAuthContext = () => useContext(AuthContext)

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  user: userFromServer,
  children,
}) => {
  const [user, setUser] = useState<null | User>(userFromServer)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const developmentLock = useRef(false)
  const fullUrl = useBaseUrlWithPath()
  const pathname = usePathname()

  const validate = async ({ ticket }: { ticket: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pre-register/login/validate/${ticket}`,
      {
        method: 'POST',
      }
    )

    const responseJson = await response.json()

    if (responseJson.statusCode === 200) {
      setIsAuthenticated(true)
      setCookie('AT', responseJson.accessToken)
      router.replace(pathname)
      router.refresh()
      return responseJson
    } else {
      setUser(null)
      setIsAuthenticated(false)
      throw new Error(responseJson.message)
    }
  }

  const login = async ({ email }: { email: string }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pre-register/login`,
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      }
    )

    const responseJson = await response.json()

    if (responseJson.statusCode === 200) {
      return responseJson
    } else {
      throw new Error(responseJson.message)
    }
  }

  useEffect(() => {
    const accessToken = getCookie('AT')
    setIsAuthenticated(!!accessToken)
    if (!developmentLock.current || process.env.NODE_ENV === 'production') {
      if (searchParams.toString().includes('ticket')) {
        const ticket = searchParams.get('ticket')
        toast.promise(validate({ ticket: ticket as string }), {
          loading: 'Logging in...',
          success: () => {
            router.refresh()
            return 'Login berhasil!'
          },
          error: (err: any) => `Oops. Login gagal! ${err.message}`,
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
    login,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
