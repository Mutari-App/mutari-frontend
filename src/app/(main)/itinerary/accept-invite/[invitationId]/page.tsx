import { customFetch } from '@/utils/newCustomFetch'
import { redirect } from 'next/navigation'

interface AcceptInvitationInteface {
  itinerary: {
    id: string
    itineraryId: string
  }
}

export default async function AcceptInvitePage({
  params,
}: {
  params: Promise<{ invitationId: string }>
}) {
  const { invitationId } = await params
  console.log(invitationId)

  const acceptResponse = await customFetch<AcceptInvitationInteface>(
    `/itineraries/${invitationId}/accept-invitation`,
    {
      method: 'POST',
    }
  )

  if (acceptResponse.statusCode === 200) {
    redirect(`/itinerary/${acceptResponse.itinerary.id}`)
  }
  console.log(acceptResponse)
  return <></>
}
