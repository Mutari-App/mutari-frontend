import { render, screen, waitFor } from '@testing-library/react'
import { customFetch } from '@/utils/customFetch'
import '@testing-library/jest-dom'
import MyItineraryList from '@/modules/ItineraryModule/sections/MyItineraryList'
import type { ItineraryData } from '@/modules/ItineraryModule/module-elements/types'

// Mock API response
jest.mock('@/utils/customFetch')
jest.mock('lucide-react', () => ({
  ChevronLeft: () => 'ChevronLeft',
  ChevronRightIcon: () => 'ChevronRightIcon',
  MapPinIcon: () => 'MapPinIcon',
  EllipsisIcon: () => 'EllipsisIcon',
}))

const mockData: ItineraryData[] = [
  {
    id: 'itinerary1',
    userId: 'user1',
    title: 'Trip to Bali',
    startDate: '2025-03-01',
    endDate: '2025-03-05',
    coverImage: 'bali.jpg',
    isPublished: false,
    isCompleted: false,
    locationCount: 0,
  },
  {
    id: 'itinerary2',
    userId: 'user2',
    title: 'Trip to Japan',
    startDate: '2025-04-10',
    endDate: '2025-04-20',
    coverImage: 'japan.jpg',
    isPublished: true,
    isCompleted: false,
    locationCount: 5,
  },
]

const mockMetadata = {
  page: 1,
  totalPages: 2,
  total: 2,
}

describe('MyItineraryList Component', () => {
  it('renders empty state when there is no data', async () => {
    render(
      <MyItineraryList data={[]} metadata={mockMetadata} refresh={jest.fn} />
    )

    await waitFor(() =>
      expect(
        screen.getByText('Belum ada rencana perjalanan.')
      ).toBeInTheDocument()
    )
  })

  it('renders itinerary list when data is available', async () => {
    render(
      <MyItineraryList
        metadata={mockMetadata}
        data={mockData}
        refresh={jest.fn}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Trip to Bali')).toBeInTheDocument()
      expect(screen.getByText('Trip to Japan')).toBeInTheDocument()
    })
  })

  it('renders pagination correctly', async () => {
    render(
      <MyItineraryList
        data={mockData}
        metadata={mockMetadata}
        refresh={jest.fn}
      />
    )

    await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument())
  })
})
