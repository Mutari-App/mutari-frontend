import ProfileModule from '@/modules/ProfileModule'
import { customFetch } from '@/utils/newCustomFetch'

export default async function ProfilePage() {
  try {
    const response = await customFetch('/auth/me')
    console.log(response)
    return (
      <>
        <ProfileModule />
      </>
    )
  } catch (err) {
    console.log(err)
    if ((err as Error).message === 'TokenExpiredOnServer') {
      return <></>
    }
  }
}
