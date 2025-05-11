import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { customFetch } from '@/utils/newCustomFetch'
import RecentlyViewedSection from '@/modules/TourMarketplaceModule/sections/RecentlyViewedSection'
import { type RecentlyViewedTourResponse } from '@/modules/TourMarketplaceModule/interface'

jest.mock('@/utils/newCustomFetch')

describe('RecentlyViewedSection', () => {
  it('should show empty message when data is empty', async () => {
    ;(customFetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({ tours: [] })
    })

    render(
      <RecentlyViewedSection
        title="Baru Dilihat"
        fetchEndpoint="/tour/views"
        mapData={(data: RecentlyViewedTourResponse) => data.tours}
        renderCard={(item) => <div key={item.id}>Card {item.id}</div>}
        emptyMessage="Tidak ada tour yang baru dilihat."
      />
    )

    await waitFor(() => {
      expect(
        screen.getByText('Tidak ada tour yang baru dilihat.')
      ).toBeInTheDocument()
    })
  })
})
