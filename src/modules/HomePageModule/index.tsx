import HeaderSection from './sections/HeaderSection'
import RecentlyViewed from './sections/RecentlyViewed'
import ExploreItinerarySection from './sections/ExploreItinerarySection'
import MyItinerarySection from './sections/MyItinerarySection'

export default function HomePageModule() {
  return (
    <div className="flex flex-col items-center gap-7 w-full mb-5">
      <HeaderSection />
      <RecentlyViewed />
      <MyItinerarySection />
      <ExploreItinerarySection />
    </div>
  )
}
