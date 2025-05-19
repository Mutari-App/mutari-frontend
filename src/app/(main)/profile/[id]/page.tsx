import ProfileModule from '@/modules/ProfileModule'
import { type ProfileProps } from '@/modules/ProfileModule/interface'
import { customFetch } from '@/utils/newCustomFetch'

interface GetProfileResponse {
  profile: ProfileProps
}

export default async function ProfilePage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const { id } = await params
  try {
    const response = await customFetch<GetProfileResponse>(`/profile/${id}`)
    return <ProfileModule profile={response.profile} />
  } catch (err) {
    if ((err as Error).message === 'TokenExpiredOnServer') {
      return <></>
    }
  }
}
