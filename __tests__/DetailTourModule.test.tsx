import { render, screen, waitFor } from '@testing-library/react'
import DetailItineraryModule from '../src/modules/DetailItineraryModule/index'
import { customFetch } from '@/utils/newCustomFetch'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import DetailTourModule from '@/modules/DetailTourModule'

// Mock dependencies
jest.mock('@/utils/newCustomFetch')

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}))
jest.mock(
  '../src/modules/DetailTourModule/module-elements/TourDescription',
  () => ({
    TourDescription: () => (
      <div data-testid="tour-description">Description Mock</div>
    ),
  })
)
jest.mock(
  '../src/modules/DetailTourModule/module-elements/TourInclude',
  () => ({
    TourInclude: () => <div data-testid="tour-include">Include Mock</div>,
  })
)
jest.mock('../src/modules/DetailTourModule/module-elements/TourList', () => ({
  TourList: () => <div data-testid="tour-list">List Mock</div>,
}))
jest.mock(
  '../src/modules/DetailTourModule/module-elements/TourOrderCard',
  () => ({
    TourOrderCard: () => (
      <div data-testid="tour-order-card">OrderCard Mock</div>
    ),
  })
)
jest.mock('../src/modules/DetailTourModule/module-elements/TourHeader', () => ({
  TourHeader: () => <div data-testid="tour-header">Header Mock</div>,
}))
jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: () => ({
    isAuthenticated: true,
    user: { id: 'user1' },
  }),
}))

jest.mock('lucide-react', () => ({
  Loader2: () => (
    <div role="status" data-testid="loading-spinner">
      Loading...
    </div>
  ),
  MapIcon: () => <div data-testid="map-icon">Map Icon</div>,
  ListChecksIcon: () => <div data-testid="list-checks-icon">List Icon</div>,
}))

const mockTour: Tour = {
  id: 'tour-1',
  title: 'Explore Bali',
  coverImage: 'https://example.com/bali.jpg',
  maxCapacity: 20,
  description: 'A 3-day tour to explore the beautiful island of Bali.',
  location: 'Bali, Indonesia',
  pricePerTicket: 1500000,
  duration: 3,
  durationType: 'DAY',
  itineraryId: 'itinerary-1',
  createdAt: '2025-05-01T10:00:00.000Z',
  updatedAt: '2025-05-10T12:00:00.000Z',
  includes: [
    {
      id: 1,
      tourid: 1,
      icon: '🚌',
      text: 'Transportation',
    },
    {
      id: 2,
      tourid: 1,
      icon: '🏨',
      text: 'Hotel',
    },
    {
      id: 3,
      tourid: 1,
      icon: '🍽️',
      text: 'Meals',
    },
  ],
  itinerary: {
    updatedAt: '2025-05-10T12:00:00.000Z',
    createdAt: '2025-05-01T10:00:00.000Z',
    id: 'itinerary-1',
    userId: 'user-1',
    title: 'Bali Adventure Itinerary',
    description: 'Itinerary for a 3-day adventure tour in Bali.',
    coverImage: 'https://example.com/itinerary-cover.jpg',
    startDate: '2025-06-01',
    endDate: '2025-06-03',
    tags: [
      {
        tag: {
          id: 'tag-1',
          name: 'Adventure',
        },
      },
      {
        tag: {
          id: 'tag-2',
          name: 'Nature',
        },
      },
    ],
    isPublished: true,
    isCompleted: false,
    sections: [
      {
        updatedAt: '2025-05-05T12:00:00.000Z',
        createdAt: '2025-05-01T10:00:00.000Z',
        id: 'section-1',
        itineraryId: 'itinerary-1',
        sectionNumber: 1,
        contingencyPlanId: null,
        title: 'Day 1: Arrival and Beach Time',
        blocks: [
          {
            updatedAt: '2025-05-05T12:00:00.000Z',
            createdAt: '2025-05-01T10:00:00.000Z',
            id: 'block-1',
            sectionId: 'section-1',
            position: 1,
            blockType: 'ACTIVITY',
            title: 'Check-in Hotel',
            description: 'Arrive at hotel and check-in.',
            startTime: '2025-06-01T12:00:00.000Z',
            endTime: '2025-06-01T13:00:00.000Z',
            location: 'Hotel Bali Sunset',
            price: 0,
            photoUrl: 'https://example.com/hotel.jpg',
            routeToNext: undefined,
            routeFromPrevious: undefined,
          },
        ],
      },
    ],
    pendingInvites: [
      {
        createdAt: '2025-04-25T10:00:00.000Z',
        email: 'friend@example.com',
        id: 'invite-1',
        itineraryId: 'itinerary-1',
        updatedAt: '2025-04-25T10:00:00.000Z',
      },
    ],
    invitedUsers: [
      {
        id: 'user-2',
        firstName: 'Jane',
        lastName: 'Doe',
        photoProfile: 'https://example.com/jane.jpg',
        email: 'jane@example.com',
      },
    ],
    user: {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Smith',
      photoProfile: 'https://example.com/john.jpg',
    },
    _count: {
      likes: 12,
    },
  },
}

describe('DetailTourModule', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useParams as jest.Mock).mockReturnValue({ id: 'tour-1' })
    ;(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    ;(customFetch as jest.Mock).mockImplementation((url: string) => {
      if (url.endsWith('/tour/tpur-1')) {
        return Promise.resolve({ statusCode: 200, data: mockTour })
      }
      return Promise.resolve({})
    })
  })

  it('update views when loading detail tour', async () => {
    ;(useParams as jest.Mock).mockReturnValue({
      id: '123',
    })
    ;(customFetch as jest.Mock).mockImplementation((url: string) => {
      return Promise.resolve({
        statusCode: 200,
        data: {
          isPublished: true,
          user: { id: 'user1' },
        },
      })
    })

    render(<DetailTourModule initialData={mockTour} />)

    expect(customFetch).toHaveBeenCalledWith(
      'tour/views/tour-1',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('logs error when viewing tour failed', async () => {
    ;(useParams as jest.Mock).mockReturnValue({
      id: 'tour-1',
      contingencyId: '456',
    })
    ;(customFetch as jest.Mock).mockImplementation((url: string) => {
      if (url.endsWith('/views/tour-1')) {
        return Promise.reject(new Error('Network error'))
      }

      return Promise.resolve({
        statusCode: 200,
        data: {
          isPublished: true,
          user: { id: 'user1' },
        },
      })
    })

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => void 0)

    render(<DetailTourModule initialData={mockTour} />)

    await waitFor(() => {
      expect(screen.getByTestId('tour-header')).toBeInTheDocument()
    })

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error viewing tour:',
      expect.any(Error)
    )

    consoleErrorSpy.mockRestore()
  })
})
