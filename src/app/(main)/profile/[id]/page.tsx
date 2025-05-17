import ProfileModule from '@/modules/ProfileModule'
import { type ProfileProps } from '@/modules/ProfileModule/interface'
import { customFetch } from '@/utils/newCustomFetch'

interface GetProfileResponse {
  profile: ProfileProps
}

export default async function ProfilePage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}>) {
  const { id } = await params
  const { tab } = await searchParams
  try {
    const response = await customFetch<GetProfileResponse>(`/profile/${id}`)
    return (
      <ProfileModule
        profile={response.profile}
        tabValue={tab as string | undefined}
      />
    )
  } catch (err) {
    if ((err as Error).message === 'TokenExpiredOnServer') {
      return <></>
    }
  }
}
