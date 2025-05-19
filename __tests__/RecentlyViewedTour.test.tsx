import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import RecentlyViewedTour from '@/modules/TourMarketplaceModule/sections/RecentlyViewedTour'
import { customFetch } from '@/utils/newCustomFetch'
import { useAuthContext } from '@/contexts/AuthContext'

// Mock customFetch
jest.mock('@/utils/newCustomFetch')
jest.mock('@/contexts/AuthContext')

jest.mock('lucide-react', () => ({
  CalendarIcon: () => <div data-testid="calendar-icon">CalendarIcon</div>,
  MapPinIcon: () => <div data-testid="map-pin-icon">MapPinIcon</div>,
}))

// Mock TourCard
jest.mock('@/modules/TourMarketplaceModule/module-elements/TourCard', () => ({
  __esModule: true,
  default: ({ tour }: { tour: { title: string } }) => (
    <div data-testid="tour-card">{tour.title}</div>
  ),
}))

const mockTourData = {
  tours: [
    {
      id: '1',
      tour: {
        id: 'tour-1',
        title: 'Tour ke Gunung',
        coverImage: '',
        location: 'Bandung',
        duration: 2,
        durationType: 'DAYS',
        pricePerTicket: 150000,
      },
      createdAt: '',
      updatedAt: '',
    },
  ],
}

describe('RecentlyViewedTour', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuthContext as jest.Mock).mockReturnValue({
      isAuthenticated: true,
    })
  })

  it('renders title and fetched tour cards', async () => {
    ;(customFetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve(mockTourData)
    })
    render(<RecentlyViewedTour />)

    // Check if the title is rendered
    expect(screen.getByText('Baru Dilihat')).toBeInTheDocument()

    // Wait for the tour card to appear
    await waitFor(() => {
      expect(screen.getByTestId('tour-card')).toHaveTextContent(
        'Tour ke Gunung'
      )
    })
  })

  it('renders empty message if no tours are returned', async () => {
    ;(customFetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({ tours: [] })
    })

    render(<RecentlyViewedTour />)

    await waitFor(() => {
      expect(
        screen.getByText('Tidak ada tour yang baru dilihat.')
      ).toBeInTheDocument()
    })
  })
})
