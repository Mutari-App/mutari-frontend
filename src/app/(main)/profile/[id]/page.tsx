import ProfileModule from '@/modules/ProfileModule'
import { ProfileProps } from '@/modules/ProfileModule/interface'
import { customFetch } from '@/utils/newCustomFetch'

interface GetProfileResponse {
  profile: ProfileProps
}

export default async function ProfilePage({
  params,
}: Readonly<{
  params: { id: string }
}>) {
  const id = params.id
  try {
    const response = await customFetch<GetProfileResponse>(`/profile/${id}`)
    console.log(response)
    return <ProfileModule profile={response.profile} />
  } catch (err) {
    console.log(err)
    if ((err as Error).message === 'TokenExpiredOnServer') {
      return <></>
    }
  }
}
