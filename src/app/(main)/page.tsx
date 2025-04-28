import HomePageModule from '@/modules/HomePageModule'
import { customFetch } from '@/utils/newCustomFetch'
import { redirect } from 'next/navigation'

export default async function Home() {
  try {
    await customFetch(`/auth/me`)
    return <HomePageModule />
  } catch (err) {
    if ((err as Error).message === 'TokenExpiredOnServer') {
      return <></>
    }
    redirect('/landing-page')
  }
}
