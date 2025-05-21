import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { customFetch } from '@/utils/newCustomFetch'
import RecentlyViewedSection from '@/modules/TourMarketplaceModule/sections/RecentlyViewedSection'
import { type RecentlyViewedTourResponse } from '@/modules/TourMarketplaceModule/interface'
import { useAuthContext } from '@/contexts/AuthContext'

jest.mock('@/utils/newCustomFetch')
jest.mock('@/contexts/AuthContext')
jest.mock('lucide-react', () => ({
  CalendarIcon: () => <div data-testid="calendar-icon">CalendarIcon</div>,
  MapPinIcon: () => <div data-testid="map-pin-icon">MapPinIcon</div>,
}))

describe('RecentlyViewedSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuthContext as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })
  })
  it('should show nothing when data is empty', async () => {
    ;(customFetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({ tours: [] })
    })

    const { container } = render(
      <RecentlyViewedSection
        title="Baru Dilihat"
        fetchEndpoint="/tour/views"
        mapData={(data: RecentlyViewedTourResponse) => data.tours}
        renderCard={(item) => <div key={item.id}>Card {item.id}</div>}
        emptyMessage="Tidak ada tour yang baru dilihat."
      />
    )

    await waitFor(() => {
      // container.firstChild bakal null kalau gak ada apa-apa yang dirender
      expect(container.firstChild).toBeNull()
    })
  })

  it('should show data when data is not empty', async () => {
    const mockTour = {
      id: 'tour-1',
    } as Tour
    ;(customFetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({ tours: [mockTour] })
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
      expect(screen.getByText('Card tour-1')).toBeInTheDocument()
    })
  })

  it('should render nothing when user is not authenticated', async () => {
    ;(customFetch as jest.Mock).mockResolvedValue({ tours: [] })
    ;(useAuthContext as jest.Mock).mockReturnValue({
      isAuthenticated: false,
    })

    const { container } = render(
      <RecentlyViewedSection
        title="Baru Dilihat"
        fetchEndpoint="/tour/views"
        mapData={(data: RecentlyViewedTourResponse) => data.tours}
        renderCard={(item) => <div key={item.id}>Card {item.id}</div>}
        emptyMessage="Tidak ada tour yang baru dilihat."
      />
    )

    await waitFor(() => {
      // container.firstChild bakal null kalau gak ada apa-apa yang dirender
      expect(container.firstChild).toBeNull()
    })
  })
})
