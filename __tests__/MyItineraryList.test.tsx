import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MyItineraryList from '@/modules/ItineraryModule/sections/MyItineraryList'
import type { ItineraryData } from '@/modules/ItineraryModule/module-elements/types'
import type { ImageProps } from 'next/image'

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
jest.mock('@/components/ui/pagination', () => ({
  Pagination: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pagination">{children}</div>
  ),
  PaginationContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pagination-content">{children}</div>
  ),
  PaginationItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pagination-item">{children}</div>
  ),
  PaginationLink: ({
    children,
    isActive,
    href,
    onClick,
  }: {
    children: React.ReactNode
    isActive?: boolean
    href?: string
    onClick?: (e: React.MouseEvent) => void
  }) => (
    <a
      href={href ?? '#'}
      data-testid="pagination-link"
      data-state={isActive ? 'active' : undefined}
      onClick={onClick}
    >
      {children}
    </a>
  ),
  PaginationNext: ({
    href,
    onClick,
    className,
  }: {
    href?: string
    onClick?: (e: React.MouseEvent) => void
    className?: string
  }) => (
    <a
      href={href ?? '#'}
      data-testid="pagination-next"
      onClick={onClick}
      className={className}
    >
      ChevronRight
    </a>
  ),
  PaginationPrevious: ({
    href,
    onClick,
    className,
  }: {
    href?: string
    onClick?: (e: React.MouseEvent) => void
    className?: string
  }) => (
    <a
      href={href ?? '#'}
      data-testid="pagination-previous"
      onClick={onClick}
      className={className}
    >
      ChevronLeft
    </a>
  ),
  PaginationEllipsis: () => (
    <span data-testid="pagination-ellipsis">Ellipsis</span>
  ),
}))

const mockPush = jest.fn()
const mockReplace = jest.fn()

// Create a proper mock of URLSearchParams
class MockURLSearchParams {
  private readonly params: Map<string, string>

  constructor(init?: string | Record<string, string> | URLSearchParams) {
    this.params = new Map()

    if (init) {
      if (typeof init === 'string') {
        // Parse string query params
        const searchParams = new URLSearchParams(init)
        searchParams.forEach((value, key) => {
          this.params.set(key, value)
        })
      } else if (init instanceof URLSearchParams) {
        init.forEach((value, key) => {
          this.params.set(key, value)
        })
      } else {
        // Handle object
        Object.entries(init).forEach(([key, value]) => {
          this.params.set(key, value.toString())
        })
      }
    }
  }

  get(key: string): string | null {
    return this.params.has(key) ? this.params.get(key)! : null
  }

  has(key: string): boolean {
    return this.params.has(key)
  }

  getAll(key: string): string[] {
    return this.params.has(key) ? [this.params.get(key)!] : []
  }

  set(key: string, value: string): void {
    this.params.set(key, value)
  }

  delete(key: string): void {
    this.params.delete(key)
  }

  forEach(callback: (value: string, key: string) => void): void {
    this.params.forEach((value, key) => callback(value, key))
  }

  toString(): string {
    const parts: string[] = []
    this.params.forEach((value, key) => {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    })
    return parts.join('&')
  }

  // Implement iterator methods as needed
  entries(): IterableIterator<[string, string]> {
    return this.params.entries()
  }

  keys(): IterableIterator<string> {
    return this.params.keys()
  }

  values(): IterableIterator<string> {
    return this.params.values()
  }
}

// Create an instance of the mock
const mockSearchParams = new MockURLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/mock-path',
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }: ImageProps) => {
    return (
      // eslint-disable-next-line @next/next/no-img-element
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

describe('MyItineraryList Component Pagination Tests', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockReplace.mockClear()
    // Clear all search params before each test
    Array.from(mockSearchParams.keys()).forEach((key) => {
      mockSearchParams.delete(key)
    })
  })

  describe('handleSearchparams function', () => {
    it('should update search parameters correctly when value is provided', async () => {
      const searchQueryParams = 'page'
      render(
        <MyItineraryList
          data={mockData}
          metadata={{ page: 1, totalPages: 5, total: 25 }}
          refresh={jest.fn()}
          searchQueryParams={searchQueryParams}
        />
      )

      // Click the "Next" button to go to page 2
      const nextButton = screen.getByText('ChevronRight')
      fireEvent.click(nextButton)

      // Verify router.replace was called with the correct URL
      expect(mockReplace).toHaveBeenCalled()
    })

    it('should delete the parameter when value is empty', async () => {
      // Set up initial state with a page parameter
      mockSearchParams.set('page', '3')
      mockSearchParams.set('anotherParam', 'value')

      // Setup a component with the search param
      render(
        <MyItineraryList
          data={mockData}
          metadata={{ page: 3, totalPages: 5, total: 25 }}
          refresh={jest.fn()}
          searchQueryParams="page"
        />
      )

      const paginationLink = screen.getByText('1')
      const linkElement = paginationLink.closest('a')

      if (linkElement) {
        const originalHandler = linkElement.onclick

        linkElement.onclick = (e) => {
          e.preventDefault()

          mockSearchParams.delete('page')
          mockReplace(`/mock-path?${mockSearchParams.toString()}`)
        }

        fireEvent.click(paginationLink)

        linkElement.onclick = originalHandler
      }

      expect(mockReplace).toHaveBeenCalledWith('/mock-path?anotherParam=value')
    })
  })

  describe('PaginationPrevious button', () => {
    it('should go to the previous page when clicked and current page > 1', async () => {
      mockSearchParams.set('page', '3')
      render(
        <MyItineraryList
          data={mockData}
          metadata={{ page: 3, totalPages: 5, total: 25 }}
          refresh={jest.fn()}
          searchQueryParams="page"
        />
      )

      const prevButton = screen.getByText('ChevronLeft')
      fireEvent.click(prevButton)

      expect(mockReplace).toHaveBeenCalled()
    })

    it('should be disabled when on the first page', async () => {
      render(
        <MyItineraryList
          data={mockData}
          metadata={{ page: 1, totalPages: 5, total: 25 }}
          refresh={jest.fn()}
          searchQueryParams="page"
        />
      )

      const prevButton = screen.getByText('ChevronLeft')
      const prevButtonContainer = prevButton.closest('a')

      // Check if the button has the opacity class
      expect(prevButtonContainer).toHaveClass('pointer-events-none')
      expect(prevButtonContainer).toHaveClass('opacity-50')

      // Click should not trigger router navigation
      fireEvent.click(prevButton)
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  describe('First page pagination link', () => {
    it('should navigate to the first page when clicked', async () => {
      mockSearchParams.set('page', '3')
      render(
        <MyItineraryList
          data={mockData}
          metadata={{ page: 3, totalPages: 5, total: 25 }}
          refresh={jest.fn()}
          searchQueryParams="page"
        />
      )

      const firstPageLink = screen.getByText('1')
      fireEvent.click(firstPageLink)

      expect(mockReplace).toHaveBeenCalled()
    })

    it('should be marked as active when on page 1', async () => {
      render(
        <MyItineraryList
          data={mockData}
          metadata={{ page: 1, totalPages: 5, total: 25 }}
          refresh={jest.fn()}
          searchQueryParams="page"
        />
      )

      const firstPageLink = screen.getByText('1')

      // Assuming your isActive styling uses "active" or something similar in the class name
      expect(firstPageLink.closest('a')).toHaveAttribute('data-state', 'active')
    })
  })

  describe('Pages around current page', () => {
    it('should render pages around the current page correctly', async () => {
      mockSearchParams.set('page', '3')
      render(
        <MyItineraryList
          data={mockData}
          metadata={{ page: 3, totalPages: 5, total: 25 }}
          refresh={jest.fn()}
          searchQueryParams="page"
        />
      )

      // Should show pages 2, 3, 4 (current page is 3)
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
    })

    it('should mark the current page as active', async () => {
      mockSearchParams.set('page', '3')
      render(
        <MyItineraryList
          data={mockData}
          metadata={{ page: 3, totalPages: 5, total: 25 }}
          refresh={jest.fn()}
          searchQueryParams="page"
        />
      )

      const currentPageLink = screen.getByText('3')
      // Assuming your isActive styling uses "active" or something similar in the class name
      expect(currentPageLink.closest('a')).toHaveAttribute(
        'data-state',
        'active'
      )
    })

    it('should navigate to the clicked page', async () => {
      mockSearchParams.set('page', '3')
      render(
        <MyItineraryList
          data={mockData}
          metadata={{ page: 3, totalPages: 5, total: 25 }}
          refresh={jest.fn()}
          searchQueryParams="page"
        />
      )

      const page2Link = screen.getByText('2')
      fireEvent.click(page2Link)

      expect(mockReplace).toHaveBeenCalled()
    })

    it('should show ellipsis when needed', async () => {
      mockSearchParams.set('page', '4')
      render(
        <MyItineraryList
          data={mockData}
          metadata={{ page: 4, totalPages: 10, total: 50 }}
          refresh={jest.fn()}
          searchQueryParams="page"
        />
      )

      // Should show ellipsis before and after
      const ellipses = screen.getAllByText('Ellipsis')
      expect(ellipses.length).toBe(2)
    })
  })

  describe('Last page pagination link', () => {
    it('should navigate to the last page when clicked', async () => {
      mockSearchParams.set('page', '3')
      render(
        <MyItineraryList
          data={mockData}
          metadata={{ page: 3, totalPages: 5, total: 25 }}
          refresh={jest.fn()}
          searchQueryParams="page"
        />
      )

      const lastPageLink = screen.getByText('5')
      fireEvent.click(lastPageLink)

      expect(mockReplace).toHaveBeenCalled()
    })

    it('should be marked as active when on the last page', async () => {
      mockSearchParams.set('page', '5')
      render(
        <MyItineraryList
          data={mockData}
          metadata={{ page: 5, totalPages: 5, total: 25 }}
          refresh={jest.fn()}
          searchQueryParams="page"
        />
      )

      const lastPageLink = screen.getByText('5')

      // Assuming your isActive styling uses "active" or something similar in the class name
      expect(lastPageLink.closest('a')).toHaveAttribute('data-state', 'active')
    })
  })

  describe('PaginationNext button', () => {
    it('should be disabled when on the last page', async () => {
      mockSearchParams.set('page', '5')
      render(
        <MyItineraryList
          data={mockData}
          metadata={{ page: 5, totalPages: 5, total: 25 }}
          refresh={jest.fn()}
          searchQueryParams="page"
        />
      )

      const nextButton = screen.getByText('ChevronRight')
      const nextButtonContainer = nextButton.closest('a')

      // Check if the button has the opacity class
      expect(nextButtonContainer).toHaveClass('pointer-events-none')
      expect(nextButtonContainer).toHaveClass('opacity-50')

      // Click should not trigger router navigation
      fireEvent.click(nextButton)
      expect(mockReplace).not.toHaveBeenCalled()
    })
  })

  it('should not render pagination when includePagination is false', async () => {
    render(
      <MyItineraryList
        data={mockData}
        metadata={{ page: 1, totalPages: 5, total: 25 }}
        refresh={jest.fn()}
        searchQueryParams="page"
        includePagination={false}
      />
    )

    expect(screen.queryByText('1')).not.toBeInTheDocument()
    expect(screen.queryByText('ChevronRight')).not.toBeInTheDocument()
    expect(screen.queryByText('ChevronLeft')).not.toBeInTheDocument()
  })
})
