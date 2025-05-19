import notFound from '@/app/not-found'
import DetailTourModule from '@/modules/DetailTourModule'
import { customFetch } from '@/utils/newCustomFetch'

export default async function TourDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  try {
    const res = await customFetch<TourDetailResponse>(
      `/tour/${(await params).id}`
    )

    if (res.statusCode === 404 || res.statusCode === 403) {
      return notFound()
    }

    return <DetailTourModule initialData={res.data} />
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return notFound()
  }
}
