import { cookies } from 'next/headers'
import { getCookie } from 'cookies-next'

export default async function useUserServer() {
  let accessToken = getCookie('AT', { cookies })
  if (!accessToken) {
    return null
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/pre-register/referral-code`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  const responseJson = await response.json()

  if (responseJson.statusCode === 200) {
    return {
      email: responseJson.email,
      referralCode: responseJson.referralCode,
      usedCount: responseJson.usedCount,
    }
  } else {
    return null
  }
}
