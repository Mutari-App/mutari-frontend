import { render, screen } from '@testing-library/react'
import { ItineraryHeader } from '@/modules/DetailItineraryModule/module-elements/ItineraryHeader'
import React from 'react'

jest.mock('lucide-react', () => ({
  X: 'X',
  Share2: 'Share2',
  UserRoundPlus: 'UserRoundPlus',
}))

// Mock the auth context
jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({
    user: { id: 'USR-123' }, // Default to matching userId in mockData
  })),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={(props as { alt: string }).alt || ''} {...props} />
  ),
}))

jest.mock('@/utils/getImage', () => ({
  getImage: jest.fn(() => '/default-image.jpg'),
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

const mockData = {
  id: 'itinerary-123',
  userId: 'USR-123',
  title: 'Trip to Bali',
  description: 'A fun trip to Bali!',
  coverImage: '/images/bali.jpg',
  startDate: '2023-06-01',
  endDate: '2023-06-10',
  createdAt: '2023-05-01T10:00:00Z',
  updatedAt: '2023-05-10T10:00:00Z',
  isPublished: true,
  isCompleted: false,
  tags: [
    { tag: { id: 'tag-1', name: 'Beach' } },
    { tag: { id: 'tag-2', name: 'Adventure' } },
  ],
  user: {
    id: 'usr-123',
    firstName: 'John',
    lastName: 'Doe',
    photoProfile: 'profile.jpg',
    email: 'john.doe@example.com',
  },
  sections: [],
  pendingInvites: [
    {
      createdAt: '2023-05-01T10:00:00Z',
      email: 'mutari@gmail.com',
      id: 'inv-123',
      itineraryId: 'itinerary-123',
      updatedAt: '2023-05-01T10:00:00Z',
    },
  ],
  invitedUsers: [
    {
      id: 'inv-456',
      firstName: 'Hoba',
      lastName: 'Hoba',
      photoProfile: 'profile.jpg',
      email: 'hobahoba@gmail.com',
    },
  ],
  _count: {
    likes: 42,
  },
}

describe('ItineraryHeader Component', () => {
  it('renders title and description correctly', () => {
    render(
      <ItineraryHeader
        data={mockData}
        refresh={function (): Promise<void> {
          throw new Error('Function not implemented.')
        }}
      />
    )
    expect(screen.getByText('Trip to Bali')).toBeInTheDocument()
    expect(screen.getByText('A fun trip to Bali!')).toBeInTheDocument()
  })

  it('renders the edit button when user is the owner', () => {
    render(
      <ItineraryHeader
        data={mockData}
        refresh={function (): Promise<void> {
          throw new Error('Function not implemented.')
        }}
      />
    )
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  it('has the correct edit page link', () => {
    render(
      <ItineraryHeader
        data={mockData}
        refresh={function (): Promise<void> {
          throw new Error('Function not implemented.')
        }}
      />
    )
    const linkElement = screen.getByRole('link', { name: /Edit/i })
    expect(linkElement).toHaveAttribute('href', `${mockData.id}/edit`)
  })
})
