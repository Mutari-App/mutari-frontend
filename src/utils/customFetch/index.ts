import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import {
  type CustomFetchBaseResponse,
  type CustomFetchRequestInit,
} from './interface'
import { deleteCookie, getCookie } from 'cookies-next'

export async function customFetch<T>(
  url: string,
  options: CustomFetchRequestInit = { uploadFile: false },
  cookies?: () => Promise<ReadonlyRequestCookies>
): Promise<CustomFetchBaseResponse & T> {
  const headers: HeadersInit = {
    authorization: '',
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

  const rawResult = await fetch(fullUrl.toString(), {
    headers,
    ...options,
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const result = await rawResult.json()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (result.message === 'Token expired') {
    await deleteCookie('AT')
  }

  return result as T & CustomFetchBaseResponse
}

export function customFetchBody(body: object) {
  return JSON.stringify(body)
}
