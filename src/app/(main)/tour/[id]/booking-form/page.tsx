import { TourBookingFormModule } from '@/modules/TourBookingFormModule'
import { customFetch } from '@/utils/newCustomFetch'
import { notFound, redirect } from 'next/navigation'

export default async function TourBookingForm({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>
  searchParams: Record<string, string | string[] | undefined>
}>) {
  if (
    searchParams.tourDate === undefined ||
    typeof searchParams.tourDate !== 'string' ||
    isNaN(new Date(searchParams.tourDate).getTime()) ||
    searchParams.guests === undefined ||
    typeof searchParams.guests !== 'string' ||
    isNaN(Number(searchParams.guests)) ||
    Number(searchParams.guests) < 1
  ) {
    redirect(`/tour/${(await params).id}`)
  }
  try {
    const res = await customFetch<TourDetailResponse>(
      `/tour/${(await params).id}`
    )

    if (res.statusCode === 404 || res.statusCode === 403) {
      return notFound()
    }

    return (
      <TourBookingFormModule
        tourDetail={res.data}
        guests={Number(searchParams.guests)}
        tourDate={new Date(searchParams.tourDate)}
      />
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return notFound()
  }
}
