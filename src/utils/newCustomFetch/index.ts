import { deleteCookie, getCookie, getCookies } from 'cookies-next'
import {
  type CustomFetchBaseResponse,
  type CustomFetchRequestInit,
} from './interface'

let isRefreshing = false
let refreshSubscribers: (() => void)[] = []

export async function customFetch<T>(
  url: string,
  options: CustomFetchRequestInit = { uploadFile: false }
): Promise<CustomFetchBaseResponse & T> {
  const isServer = typeof window === 'undefined'

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL!
  const fullUrl = new URL(url, baseUrl)

  if (options.uploadFile) {
    delete headers['Content-Type']
  }

  let AT
  if (isServer) {
    const { cookies } = await import('next/headers')
    const serverCookies = await cookies()
    AT = serverCookies.get('AT')?.value
  } else {
    AT = await getCookie('AT')
  }

  if (AT) {
    headers.authorization = `Bearer ${String(AT)}`
  }
  if (isServer) {
    const { cookies } = await import('next/headers')
    const serverCookies = await cookies()
    headers.Cookie = serverCookies.toString()
  }

  let rawResult = await fetch(fullUrl.toString(), {
    headers,
    credentials: 'include',
    ...options,
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let result = (await rawResult.json()) as CustomFetchBaseResponse

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (
    result.message === 'token has expired' ||
    result.message === 'token not provided'
  ) {
    if (isServer) {
      const { cookies } = await import('next/headers')
      const serverCookies = await cookies()
      const refreshToken = serverCookies.get('refreshToken')
      if (refreshToken) {
        throw new Error('TokenExpiredOnServer')
      }
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshSubscribers.push(() => {
          resolve(customFetch(url, options))
        })
      })
    }
    isRefreshing = true

    const isRefreshSuccess = await handleRefreshToken()
    isRefreshing = false
    refreshSubscribers.forEach((callback) => callback())
    refreshSubscribers = []

    if (isRefreshSuccess) {
      rawResult = await fetch(fullUrl.toString(), {
        headers,
        credentials: 'include',
        ...options,
      })

      result = (await rawResult.json()) as CustomFetchBaseResponse
    } else {
      void fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      await deleteCookie('refreshToken')
      await deleteCookie('accessToken')
      throw new Error('Sesi habis, silahkan login kembali.')
    }
  }

  return result as T & CustomFetchBaseResponse
}

async function handleRefreshToken(): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: 'POST',
        credentials: 'include',
      }
    )

    const responseJson = (await response.json()) as CustomFetchBaseResponse

    if (responseJson.statusCode !== 200) {
      throw new Error('Failed to refresh token')
    }

    return true
  } catch (error) {
    return false
  }
}

export function customFetchBody(body: object) {
  return JSON.stringify(body)
}
