import { render, screen } from '@testing-library/react'
import { ItineraryHeader } from '@/modules/DetailItineraryModule/module-elements/ItineraryHeader'
import React from 'react'
import userEvent from '@testing-library/user-event'

// Mock the auth context
jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({
    user: { id: 'USR-123' }, // Default to matching userId in mockData
  })),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => (
    <img alt={((props as { alt: string }).alt as string) || ''} {...props} />
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
  sections: [],
}

describe('ItineraryHeader Component', () => {
  it('renders title and description correctly', () => {
    render(<ItineraryHeader data={mockData} />)
    expect(screen.getByText('Trip to Bali')).toBeInTheDocument()
    expect(screen.getByText('A fun trip to Bali!')).toBeInTheDocument()
  })

  it('renders the edit button when user is the owner', () => {
    render(<ItineraryHeader data={mockData} />)
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  it('does not render the edit button when user is not the owner', () => {
    // Update the mock to return a different user ID
    const authContextMock = jest.requireMock('@/contexts/AuthContext') as {
      useAuthContext: jest.Mock
    }
    authContextMock.useAuthContext.mockReturnValueOnce({
      user: { id: 'different-user' },
    })

    render(<ItineraryHeader data={mockData} />)
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()
  })

  it('has the correct edit page link', () => {
    render(<ItineraryHeader data={mockData} />)
    const linkElement = screen.getByRole('link', { name: /Edit/i })
    expect(linkElement).toHaveAttribute('href', `${mockData.id}/edit`)
  })
})
