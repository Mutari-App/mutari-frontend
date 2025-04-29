'use client'

import { ProfileHeader } from './sections/ProfileHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ItinerariesSection } from './sections/ItinerariesSection'
import { LikedItinerariesSection } from './sections/LikedItinerariesSection'
import { ProfileModuleProps } from './interface'
// import { TransactionSection } from './sections/TransactionSection'

export default function ProfileModule({
  profile,
}: Readonly<ProfileModuleProps>) {
  return (
    <div className="min-h-screen container mx-auto max-w-screen-xl px-3 pt-28 sm:pt-32 md:pt-40">
      <ProfileHeader {...profile} />
      <Tabs defaultValue="itineraries">
        <TabsList className="mt-2 sm:mt-4 md:mt-8">
          <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
          <TabsTrigger value="likedItineraries">Itinerary disukai</TabsTrigger>
          {/* <TabsTrigger value="transaction">Transaksi</TabsTrigger> */}
        </TabsList>
        <TabsContent value="itineraries">
          <ItinerariesSection profile={profile} />
        </TabsContent>
        <TabsContent value="likedItineraries">
          <LikedItinerariesSection profile={profile} />
        </TabsContent>
        {/* <TabsContent value="transaction">
          <TransactionSection />
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
