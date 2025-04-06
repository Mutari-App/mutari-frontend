import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MyItineraryList from '@/modules/ItineraryModule/sections/MyItineraryList'
import type { ItineraryData } from '@/modules/ItineraryModule/module-elements/types'
import { ImageProps } from 'next/image'
import { ChevronRightIcon } from 'lucide-react'

// Mock API response
jest.mock('@/utils/customFetch')
jest.mock('lucide-react', () => ({
  ChevronLeft: () => 'ChevronLeft',
  ChevronRight: () => 'ChevronRight',
  ChevronRightIcon: () => 'ChevronRightIcon',
  MapPin: () => 'MapPin',
  Ellipsis: () => 'Ellipsis',
}))

jest.mock('@/modules/ItineraryModule/module-elements/ItineraryCard', () => ({
  __esModule: true,
  default: ({ item }: { item: Itinerary }) => (
    <div data-testid="itinerary-card">
      <h3>{item.title}</h3>
    </div>
  ),
}))

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    has: jest.fn(),
    getAll: jest.fn(),
    forEach: jest.fn(),
    entries: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
  }),
  usePathname: () => '/mock-path',
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }: ImageProps) => {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        {...props}
        alt={alt || ''}
        src={typeof props.src === 'string' ? props.src : ''}
      />
    )
  },
}))

const mockData: ItineraryData[] = [
  {
    id: 'itinerary1',
    userId: 'user1',
    title: 'Trip to Bali',
    startDate: '2025-03-01',
    endDate: '2025-03-05',
    coverImage: 'https://example.com/images/bali.jpg',
    isPublished: false,
    isCompleted: false,
    locationCount: 0,
    pendingInvites: [],
    invitedUsers: [],
  },
  {
    id: 'itinerary2',
    userId: 'user2',
    title: 'Trip to Japan',
    startDate: '2025-04-10',
    endDate: '2025-04-20',
    coverImage: 'https://example.com/images/japan.jpg',
    isPublished: true,
    isCompleted: false,
    locationCount: 5,
    pendingInvites: [],
    invitedUsers: [],
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
      <MyItineraryList
        searchQueryParams=""
        data={[]}
        metadata={mockMetadata}
        refresh={jest.fn()}
      />
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
        refresh={jest.fn()}
        searchQueryParams=""
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
        refresh={jest.fn()}
        searchQueryParams=""
      />
    )

    await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument())
  })
})
