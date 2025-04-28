/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ItineraryCard from '@/modules/ItinerarySearchResultsModule/module-elements/ItineraryCard'
import { type ItinerarySearchResult } from '@/modules/ItinerarySearchResultsModule/interface'

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

jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({
    children,
    className,
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  ),
  AvatarImage: ({ src, alt }: { src?: string; alt: string }) => (
    <img data-testid="avatar-image" src={src} alt={alt} />
  ),
  AvatarFallback: ({
    children,
    className,
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="avatar-fallback" className={className}>
      {children}
    </div>
  ),
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({
    children,
    variant,
    className,
  }: React.PropsWithChildren<{ variant?: string; className?: string }>) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  ),
}))

// Mock the LikesButton component
jest.mock(
  '@/modules/ItinerarySearchResultsModule/module-elements/LikesButton',
  () => ({
    __esModule: true,
    default: ({ count, className }: { count: number; className?: string }) => (
      <div data-testid="likes-button" data-count={count} className={className}>
        Likes: {count}
      </div>
    ),
  })
)

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn().mockReturnValue('01 Jan 2023'),
}))

jest.mock('date-fns/locale', () => ({
  id: {},
}))

describe('ItineraryCard Component', () => {
  const mockItinerary: ItinerarySearchResult = {
    id: 'itinerary-123',
    title: 'Wonderful Bali Trip',
    description: 'A fantastic 5-day journey through Bali',
    coverImage: 'https://example.com/bali.jpg',
    daysCount: 5,
    createdAt: '01 Apr 2025',
    likes: 1200,
    user: {
      id: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      photoProfile: 'https://example.com/john.jpg',
    },
    tags: [
      { tag: { id: 'tag-1', name: 'Beach' } },
      { tag: { id: 'tag-2', name: 'Adventure' } },
      { tag: { id: 'tag-3', name: 'Nature' } },
      { tag: { id: 'tag-4', name: 'Culture' } },
    ],
  }

  test('renders itinerary card with all elements', () => {
    render(<ItineraryCard itinerary={mockItinerary} />)

    // Check if the card is rendered
    expect(screen.getByTestId('card')).toBeInTheDocument()

    // Check if the image is rendered
    expect(screen.getByTestId('next-image')).toHaveAttribute(
      'src',
      'https://example.com/bali.jpg'
    )

    // Check if title and description are rendered
    expect(screen.getByText('Wonderful Bali Trip')).toBeInTheDocument()
    expect(
      screen.getByText('A fantastic 5-day journey through Bali')
    ).toBeInTheDocument()

    // Check if the days count and date are displayed
    expect(screen.getByText(/5 hari • Dibuat pada/)).toBeInTheDocument()

    // Check if user information is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument()

    // Check if tags are rendered (limited to 3 by default)
    expect(screen.getByText('Beach')).toBeInTheDocument()
    expect(screen.getByText('Adventure')).toBeInTheDocument()
    expect(screen.getByText('Nature')).toBeInTheDocument()

    // Check if the "+1" badge is shown for the remaining tag
    expect(screen.getByText('+')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()

    // Check if likes count is rendered - using getAllByTestId because there are two buttons
    const likesButtons = screen.getAllByTestId('likes-button')
    expect(likesButtons.length).toBe(2) // One for mobile, one for desktop
    expect(likesButtons[0]).toHaveAttribute('data-count', '1200')
    expect(likesButtons[1]).toHaveAttribute('data-count', '1200')
  })

  test('renders default image placeholder when no cover image is provided', () => {
    const itineraryNoImage = {
      ...mockItinerary,
      coverImage: null,
    }

    render(<ItineraryCard itinerary={itineraryNoImage} />)

    // Check if the placeholder text is rendered
    expect(screen.getByText('Tidak Ada Gambar')).toBeInTheDocument()
  })

  test('renders initials in avatar when no profile photo is provided', () => {
    const itineraryNoUserPhoto = {
      ...mockItinerary,
      user: {
        ...mockItinerary.user,
        photoProfile: null,
      },
    }

    render(<ItineraryCard itinerary={itineraryNoUserPhoto} />)

    // Check if avatar fallback with initials is rendered
    expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('JD') // Initials of John Doe
  })

  test('limits visible tags to the specified maxVisibleTags prop', () => {
    // Set maxVisibleTags to 2
    render(<ItineraryCard itinerary={mockItinerary} maxVisibleTags={2} />)

    // Only the first 2 tags should be visible
    expect(screen.getByText('Beach')).toBeInTheDocument()
    expect(screen.getByText('Adventure')).toBeInTheDocument()
    expect(screen.queryByText('Nature')).not.toBeInTheDocument()

    // +2 badge should be shown for the remaining 2 tags
    expect(screen.getByText('+')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  test('renders all tags when there are fewer than maxVisibleTags', () => {
    const fewTagsItinerary = {
      ...mockItinerary,
      tags: mockItinerary.tags.slice(0, 2), // Only keep the first 2 tags
    }

    render(<ItineraryCard itinerary={fewTagsItinerary} maxVisibleTags={3} />)

    // Both tags should be visible
    expect(screen.getByText('Beach')).toBeInTheDocument()
    expect(screen.getByText('Adventure')).toBeInTheDocument()

    // No '+n' badge should be shown
    expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument()
  })

  test('handles itinerary with no tags', () => {
    const noTagsItinerary = {
      ...mockItinerary,
      tags: [],
    }

    render(<ItineraryCard itinerary={noTagsItinerary} />)

    // No tags or '+n' badge should be shown
    expect(screen.queryByTestId('badge')).not.toBeInTheDocument()
  })

  test('renders correct link URLs for itinerary and user profile', () => {
    render(<ItineraryCard itinerary={mockItinerary} />)

    const links = screen.getAllByTestId('next-link')

    // Find the itinerary link
    const itineraryLink = links.find(
      (link) => link.getAttribute('href') === `/itinerary/${mockItinerary.id}`
    )
    expect(itineraryLink).toBeInTheDocument()

    // Find the user profile link
    const userProfileLink = links.find(
      (link) =>
        link.getAttribute('href') === `/profile/${mockItinerary.user.id}`
    )
    expect(userProfileLink).toBeInTheDocument()
  })
})
