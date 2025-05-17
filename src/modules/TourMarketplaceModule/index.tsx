import ExploreTourSection from './sections/ExploreTourSection'
import HeaderSection from './sections/HeaderSection'

export default function TourMarketplaceModule() {
  return (
    <div className="flex flex-col items-center gap-7 w-full mb-5">
      <HeaderSection />
      <ExploreTourSection />
    </div>
  )
}
