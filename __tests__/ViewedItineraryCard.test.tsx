import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation'
import ViewedItineraryCard from '@/modules/HomePageModule/module-elements/ViewedItineraryCard'
import { ItineraryData } from '@/modules/ItineraryModule/module-elements/types'

// Mock the dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: () => ({
    user: { id: 'test-user-id', firstName: 'Test User' },
  }),
}))

jest.mock('@/utils/getImage', () => ({
  getImage: (path: string) => `/mocked-path/${path}`,
}))

jest.mock('lucide-react', () => ({
  Heart: () => <div>Heart</div>,
}))

// Sample test data
const mockItineraryItem = {
  id: 'itinerary-123',
  title: 'Paris Adventure',
  description: 'A wonderful trip to Paris',
  coverImage: 'https://example.com/paris.jpg',
  likes: 10,
  userId: 'user-456',
  user: {
    firstName: 'John',
    lastName: 'Doe',
  },
} as unknown as ItineraryData

describe('ViewedItineraryCard', () => {
  it('renders the component with correct data', () => {
    render(<ViewedItineraryCard item={mockItineraryItem} />)

    expect(screen.getByText('Paris Adventure')).toBeInTheDocument()
    expect(screen.getByText('A wonderful trip to Paris')).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByAltText('Paris Adventure')).toBeInTheDocument()
  })

  it('navigates to itinerary detail page when clicked', () => {
    const mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })

    render(<ViewedItineraryCard item={mockItineraryItem} />)

    const card = screen.getByText('Paris Adventure').closest('div')
    if (card) {
      fireEvent.click(card)
      expect(mockPush).toHaveBeenCalledWith('/itinerary/itinerary-123')
    } else {
      throw new Error('Card element not found')
    }
  })

  it('toggles like status when heart icon is clicked', async () => {
    render(<ViewedItineraryCard item={mockItineraryItem} />)

    const heartIcon = screen.getByTestId('heart-icon')

    // Click to like
    fireEvent.click(heartIcon)
    expect(heartIcon).toHaveClass('text-red-500')

    // Click to unlike
    fireEvent.click(heartIcon)
    expect(heartIcon).not.toHaveClass('text-red-500')
  })
})
