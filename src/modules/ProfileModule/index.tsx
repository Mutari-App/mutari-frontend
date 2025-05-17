'use client'

import { ProfileHeader } from './sections/ProfileHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ItinerariesSection } from './sections/ItinerariesSection'
import { LikedItinerariesSection } from './sections/LikedItinerariesSection'
import { type ProfileModuleProps } from './interface'
import { TransactionSection } from './sections/TransactionSection'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ProfileModule({
  profile,
  tabValue,
}: Readonly<ProfileModuleProps>) {
  const { user } = useAuthContext()
  const router = useRouter()
  const searchParams = useSearchParams()

  const setTabSearchParam = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', value)
    router.push(`?${params.toString()}`, { scroll: false })
  }
  return (
    <div className="min-h-screen container mx-auto max-w-screen-xl px-3 pt-28 sm:pt-32 md:pt-40">
      <ProfileHeader {...profile} />
      <Tabs defaultValue={tabValue ?? 'itineraries'}>
        <TabsList className="mt-2 sm:mt-4 md:mt-8 w-full md:w-auto">
          <TabsTrigger
            onClick={() => setTabSearchParam('itineraries')}
            value="itineraries"
          >
            Itineraries
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setTabSearchParam('likedItineraries')}
            value="likedItineraries"
          >
            Itinerary disukai
          </TabsTrigger>
          {user?.id === profile.id && (
            <TabsTrigger
              onClick={() => setTabSearchParam('transaction')}
              value="transaction"
            >
              Transaksi
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="itineraries">
          <ItinerariesSection profile={profile} />
        </TabsContent>
        <TabsContent value="likedItineraries">
          <LikedItinerariesSection profile={profile} />
        </TabsContent>
        <TabsContent value="transaction">
          <TransactionSection profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
