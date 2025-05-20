import { TourBookingFormModule } from '@/modules/TourBookingFormModule'
import { customFetch } from '@/utils/newCustomFetch'
import { notFound, redirect } from 'next/navigation'

export default async function TourBookingForm({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}>) {
  const { tourDate, guests } = await searchParams
  if (
    tourDate === undefined ||
    typeof tourDate !== 'string' ||
    isNaN(new Date(tourDate).getTime()) ||
    guests === undefined ||
    typeof guests !== 'string' ||
    isNaN(Number(guests)) ||
    Number(guests) < 1
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
        guests={Number(guests)}
        tourDate={new Date(tourDate)}
      />
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return notFound()
  }
}
