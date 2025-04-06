import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import {
  type CustomFetchBaseResponse,
  type CustomFetchRequestInit,
} from './interface'
import { deleteCookie, getCookie } from 'cookies-next'

let isRefreshing = false
let refreshSubscribers: (() => void)[] = []

export async function customFetch<T>(
  url: string,
  options: CustomFetchRequestInit = { uploadFile: false },
  cookies?: () => Promise<ReadonlyRequestCookies>
): Promise<CustomFetchBaseResponse & T> {
  const isServer = typeof window === 'undefined'

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL!
  const fullUrl = new URL(url, baseUrl)

  if (options.isAuthorized) {
    let token: string | undefined | null = null

    if (cookies) {
      // Server-side: use ReadonlyRequestCookies
      const serverCookies = await cookies()
      token = serverCookies.get('AT')?.value
    } else {
      // Client-side: use cookies-next with proper type handling
      const clientToken = getCookie('AT')
      token = typeof clientToken === 'string' ? clientToken : undefined
    }

    if (token) {
      headers.authorization = `Bearer ${token}`
    } else {
      await deleteCookie('AT')
    }
  }

  if (options.uploadFile) {
    delete headers['Content-Type']
  }

  if (isServer) {
    const { cookies } = await import('next/headers')
    const serverCookies = await cookies()
    headers.Cookies = serverCookies.toString()
  }

  console.log(headers.authorization)

  let rawResult = await fetch(fullUrl.toString(), {
    headers,
    ...options,
    credentials: 'include',
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let result = (await rawResult.json()) as CustomFetchBaseResponse

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (
    result.message === 'token has expired' ||
    result.message === 'token not provided'
  ) {
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
        ...options,
        credentials: 'include',
      })

      result = (await rawResult.json()) as CustomFetchBaseResponse
    } else {
      void fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      // throw new Error('Session expired, please login again.')
    }
  }

  return result as T & CustomFetchBaseResponse
}

export function customFetchBody(body: object) {
  return JSON.stringify(body)
}

async function handleRefreshToken(): Promise<boolean> {
  const isServer = typeof window === 'undefined'

  let serverCookies

  if (isServer) {
    const { cookies } = await import('next/headers')
    serverCookies = await cookies()
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: 'POST',
        credentials: 'include',
        headers: isServer ? { Cookie: serverCookies!.toString() } : {},
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
