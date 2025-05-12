'use client'

import { ProfileHeader } from './sections/ProfileHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ItinerariesSection } from './sections/ItinerariesSection'
import { LikedItinerariesSection } from './sections/LikedItinerariesSection'
import { ProfileModuleProps } from './interface'
import { TransactionSection } from './sections/TransactionSection'
import { useAuthContext } from '@/contexts/AuthContext'

export default function ProfileModule({
  profile,
}: Readonly<ProfileModuleProps>) {
  const { user } = useAuthContext()
  return (
    <div className="min-h-screen container mx-auto max-w-screen-xl px-3 pt-28 sm:pt-32 md:pt-40">
      <ProfileHeader {...profile} />
      <Tabs defaultValue="itineraries">
        <TabsList className="mt-2 sm:mt-4 md:mt-8 w-full md:w-auto">
          <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
          <TabsTrigger value="likedItineraries">Itinerary disukai</TabsTrigger>
          {user?.id === profile.id && (
            <TabsTrigger value="transaction">Transaksi</TabsTrigger>
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
