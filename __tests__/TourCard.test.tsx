import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { type TourCardProps } from '@/modules/TourMarketplaceModule/interface'
import { type ImageProps } from 'next/image'
import TourCard from '@/modules/TourMarketplaceModule/module-elements/TourCard'

// Mock next/image and next/link
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
// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
  }: {
    href: string
    children: React.ReactNode
  }) => <a href={href}>{children}</a>,
}))
jest.mock('lucide-react', () => ({
  CalendarIcon: () => <div data-testid="calendar-icon">CalendarIcon</div>,
  MapPinIcon: () => <div data-testid="map-pin-icon">MapPinIcon</div>,
}))

// Sample mock data
const mockTour: TourCardProps['tour'] = {
  id: 'tour-1',
  title: 'Wisata Alam Bandung',
  location: 'Bandung',
  duration: 3,
  durationType: 'DAY',
  pricePerTicket: '150000',
  coverImage: 'https://example.com/image.jpg',
  maxCapacity: 0,
  itineraryId: 'tour-1',
  createdAt: '',
  updatedAt: '',
}

describe('TourCard', () => {
  it('renders correctly with cover image', () => {
    render(<TourCard tour={mockTour} />)

    expect(screen.getByText('Wisata Alam Bandung')).toBeInTheDocument()
    expect(screen.getByText('Bandung')).toBeInTheDocument()
    expect(screen.getByText('3 hari')).toBeInTheDocument()
    expect(screen.getByText('Rp150.000/pax')).toBeInTheDocument()

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', mockTour.coverImage)
  })

  it('shows placeholder when no cover image', () => {
    const noImageTour = { ...mockTour, coverImage: '' }
    render(<TourCard tour={noImageTour} />)

    expect(screen.getByText('Tidak Ada Gambar')).toBeInTheDocument()
  })

  it('has link to tour detail page', () => {
    render(<TourCard tour={mockTour} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/tour/${mockTour.id}`)
  })
})
