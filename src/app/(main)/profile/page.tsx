import ProfileModule from '@/modules/ProfileModule'
import { customFetch } from '@/utils/customFetch'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function Home() {
  const cookieStore = await cookies()

  // Contoh pemanggilan endpoint protected pada Server Side
  try {
    // const response = await customFetch('/auth/me', {
    //   credentials: 'include',
    //   headers: {
    //     Cookie: cookieStore.toString(),
    //   },
    // })

    // if (response.statusCode !== 200) throw new Error()

    return <ProfileModule />
  } catch (err) {
    redirect('/login')
  }
}
