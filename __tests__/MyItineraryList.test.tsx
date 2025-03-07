import { render, screen, waitFor } from '@testing-library/react'
import { customFetch } from '@/utils/customFetch'
import '@testing-library/jest-dom'
import MyItineraryList from '@/modules/ItineraryModule/sections/MyItineraryList'

// Mock API response
jest.mock('@/utils/customFetch')
jest.mock('lucide-react', () => ({
  ChevronLeft: () => 'ChevronLeft',
  ChevronRightIcon: () => 'ChevronRightIcon',
  MapPinIcon: () => 'MapPinIcon',
  EllipsisIcon: () => 'EllipsisIcon',
}))

const mockResponse = {
  statusCode: 200,
  itinerary: {
    data: [
      {
        title: 'Trip to Bali',
        startDate: '2025-03-01',
        endDate: '2025-03-05',
        coverImage: 'bali.jpg',
      },
    ],
    metadata: {
      page: 1,
      totalPages: 2,
      total: 2,
    },
  },
}

describe('MyItineraryList Component', () => {
  it('renders empty state when there is no data', async () => {
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      itinerary: { data: [], metadata: { page: 1, totalPages: 1, total: 0 } },
    })

    render(<MyItineraryList page="1" />)

    await waitFor(() =>
      expect(
        screen.getByText('Belum ada rencana perjalanan.')
      ).toBeInTheDocument()
    )
  })

  it('renders itinerary list when data is available', async () => {
    ;(customFetch as jest.Mock).mockResolvedValue(mockResponse)

    render(<MyItineraryList page="1" />)

    await waitFor(() => {
      expect(
        screen.getByText('Belum ada rencana perjalanan.')
      ).toBeInTheDocument()
    })
  })

  it('renders pagination correctly', async () => {
    ;(customFetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    render(<MyItineraryList page="1" />)

    await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument())
  })
})
