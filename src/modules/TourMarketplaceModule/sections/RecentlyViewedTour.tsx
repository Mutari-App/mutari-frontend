'use client'

import React from 'react'
import TourCard from '../module-elements/TourCard'
import RecentlyViewedSection from './RecentlyViewedSection'
import { type RecentlyViewedTourResponse } from '../interface'

function RecentlyViewedTour() {
  return (
    <RecentlyViewedSection
      title="Baru Dilihat"
      fetchEndpoint="/tour/views"
      mapData={(data: RecentlyViewedTourResponse) => data.tours}
      renderCard={(tourView) => (
        <TourCard tour={tourView.tour} key={tourView.id} />
      )}
      emptyMessage="Tidak ada tour yang baru dilihat."
    />
  )
}

export default RecentlyViewedTour
