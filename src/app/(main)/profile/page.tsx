import ProfileModule from '@/modules/ProfileModule'
import { customFetch } from '@/utils/customFetch'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()

  // Contoh pemanggilan endpoint protected pada Server Side
  const response = await customFetch('/itinerary/', {
    credentials: 'include',
    headers: {
      Cookie: cookieStore.toString(),
    },
  })

  console.log('serverSide: ', response)

  return <ProfileModule />
}
