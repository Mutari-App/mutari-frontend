import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import TourCard from '@/modules/TourSearchResultsModule/module-elements/TourCard'
import { type TourSearchResult } from '@/modules/TourSearchResultsModule/interface'

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    fill,
    className,
  }: {
    src: string
    alt: string
    fill?: boolean
    className?: string
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-testid="next-image"
      src={src}
      alt={alt}
      className={className}
      style={fill ? { objectFit: 'cover' } : {}}
    />
  ),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    className,
    children,
  }: React.PropsWithChildren<{ href: string; className?: string }>) => (
    <a href={href} className={className} data-testid="next-link">
      {children}
    </a>
  ),
}))

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({
    children,
    className,
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardContent: ({
    children,
    className,
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
  CardFooter: ({
    children,
    className,
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="card-footer" className={className}>
      {children}
    </div>
  ),
}))

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  MapPinIcon: () => <div data-testid="map-pin-icon">MapPinIcon</div>,
  CalendarIcon: () => <div data-testid="calendar-icon">CalendarIcon</div>,
}))

// Mock DurationTypeMap constant
jest.mock('@/modules/TourMarketplaceModule/constant', () => ({
  DurationTypeMap: {
    DAY: 'hari',
    HOUR: 'jam',
  },
}))

describe('TourCard Component', () => {
  const mockTour: TourSearchResult = {
    id: 'tour-123',
    title: 'Bali Adventure Tour',
    coverImage: 'https://example.com/bali-tour.jpg',
    maxCapacity: 20,
    description: 'Explore the beauty of Bali',
    location: 'Bali, Indonesia',
    pricePerTicket: 1500000, // Changed to number instead of string
    duration: 3,
    durationType: 'DAY', // Using the proper type from interface
    availableTickets: 10,
    includes: ['Hotel', 'Meals', 'Transport'],
    itinerary: 'Day 1: Arrival, Day 2: Beach, Day 3: Departure',
    user: {
      id: 'user-123',
      firstName: 'Tour',
      lastName: 'Guide',
      photoProfile: 'https://example.com/guide.jpg',
    },
  }

  test('renders tour card with all elements', () => {
    render(<TourCard tour={mockTour} />)

    // Check if the card is rendered
    expect(screen.getByTestId('card')).toBeInTheDocument()

    // Check if the image is rendered
    expect(screen.getByTestId('next-image')).toHaveAttribute(
      'src',
      'https://example.com/bali-tour.jpg'
    )

    // Check if title is rendered
    expect(screen.getByText('Bali Adventure Tour')).toBeInTheDocument()

    // Check if location is displayed
    expect(screen.getByText('Bali, Indonesia')).toBeInTheDocument()

    // Check if duration is displayed correctly
    expect(screen.getByText('3 hari')).toBeInTheDocument()

    // Check if available tickets info is displayed
    expect(screen.getByText('10 tiket tersedia')).toBeInTheDocument()

    // Check if price is displayed
    // Use a regex to match price format which might vary in tests vs. implementation
    expect(screen.getByTestId('card-footer').textContent).toMatch(
      /Rp1.500.000/i
    )
  })

  test('renders default image placeholder when no cover image is provided', () => {
    const tourNoImage = {
      ...mockTour,
      coverImage: null,
    }

    render(<TourCard tour={tourNoImage} />)

    // Check if the placeholder text is rendered
    expect(screen.getByText('Tidak Ada Gambar')).toBeInTheDocument()
  })

  test('renders sold out badge when no tickets available', () => {
    const soldOutTour = {
      ...mockTour,
      availableTickets: 0,
    }

    render(<TourCard tour={soldOutTour} />)

    // Check if the sold out badge is rendered
    expect(screen.getByText('Tiket habis')).toBeInTheDocument()
  })

  test('formats duration correctly for days and hours', () => {
    // Test with days
    const tourWithDays = {
      ...mockTour,
      duration: 5,
      durationType: 'DAY' as const, // Use "as const" to ensure type safety
    }

    const { rerender } = render(<TourCard tour={tourWithDays} />)
    expect(screen.getByText('5 hari')).toBeInTheDocument()

    // Test with hours
    const tourWithHours = {
      ...mockTour,
      duration: 4,
      durationType: 'HOUR' as const, // Use "as const" to ensure type safety
    }

    rerender(<TourCard tour={tourWithHours} />)
    expect(screen.getByText('4 jam')).toBeInTheDocument()
  })

  test('renders tour price with correct format', () => {
    // Test with a large number
    const tourExpensive = {
      ...mockTour,
      pricePerTicket: 25000000, // Using number not string
    }

    render(<TourCard tour={tourExpensive} />)

    // Price should be in the footer
    const footer = screen.getByTestId('card-footer')
    expect(footer.textContent).toMatch(/Rp25.000.000/i)
  })

  test('renders correct link URLs for tour detail', () => {
    render(<TourCard tour={mockTour} />)

    const links = screen.getAllByTestId('next-link')

    // Find the tour link
    const tourLink = links.find(
      (link) => link.getAttribute('href') === `/tour/${mockTour.id}`
    )
    expect(tourLink).toBeInTheDocument()
  })
})
