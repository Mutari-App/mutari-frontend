import HeaderSection from './sections/HeaderSection'
import RecentlyViewedTour from './sections/RecentlyViewedTour'

export default function TourMarketplaceModule() {
  return (
    <div className="flex flex-col items-center gap-7 w-full mb-5">
      <HeaderSection />
      <RecentlyViewedTour />
    </div>
  )
}
