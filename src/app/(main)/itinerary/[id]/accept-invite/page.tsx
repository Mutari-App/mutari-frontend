import { AcceptInviteModule } from '@/modules/AcceptInviteModule'

export default async function AcceptInvitePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <AcceptInviteModule itineraryId={id} />
}
