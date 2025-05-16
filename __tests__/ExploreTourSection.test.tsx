import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import ExploreTourSection from '@/modules/TourMarketplaceModule/sections/ExploreTourSection'
import { customFetch } from '@/utils/newCustomFetch'
import { Tour } from '@/modules/TourMarketplaceModule/interface'

jest.mock('@/utils/newCustomFetch', () => ({
  customFetch: jest.fn(),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={(props as { alt: string }).alt || ''} {...props} />
  ),
}))

jest.mock('@/modules/TourMarketplaceModule/module-elements/TourCard', () => ({
  __esModule: true,
  default: ({ tour }: any) => <div>{tour.title}</div>,
}))

const mockTours: Tour[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `tour-${i}`,
  title: `Tour ${i}`,
  coverImage: '/images/bali.jpg',
  location: `Location ${i}`,
  pricePerTicket: '100',
  availableTickets: 10,
  duration: 3,
  durationType: 'DAY',
  createdAt: new Date().toISOString(),
  maxCapacity: 20,
  itineraryId: `itinerary-${i}`,
  updatedAt: new Date().toISOString(),
}))

describe('ExploreTourSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', async () => {
    (customFetch as jest.Mock).mockResolvedValueOnce({ data: mockTours })

    render(<ExploreTourSection />)

    expect(await screen.findAllByRole('status')).toHaveLength(8)
  })

  it('fetches and displays tours correctly', async () => {
    (customFetch as jest.Mock).mockResolvedValueOnce({ data: mockTours })

    render(<ExploreTourSection />)

    await waitFor(() => {
      expect(screen.getByText('Tour 0')).toBeInTheDocument()
    })
  })

  it('loads more tours when button is clicked', async () => {
    (customFetch as jest.Mock)
      .mockResolvedValueOnce({ data: mockTours })
      .mockResolvedValueOnce({
        data: mockTours.map((t) => ({ ...t, id: `${t.id}-more` })),
      })

    render(<ExploreTourSection />)

    await waitFor(() => {
      expect(screen.getByText('Tour 0')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText(/Lihat Lebih Banyak/i))

    await waitFor(() => {
      expect(screen.getByText('Tour 0')).toBeInTheDocument()
      expect(screen.getByText('Tour 0')).toBeTruthy()
    })

    expect(screen.getAllByText(/Tour/)).toHaveLength(17)
  })
})
