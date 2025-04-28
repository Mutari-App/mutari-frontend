import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LikesButton from '@/modules/ItinerarySearchResultsModule/module-elements/LikesButton'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Heart: () => <div data-testid="heart-icon">HeartIcon</div>,
}))

describe('LikesButton Component', () => {
  test('renders correctly with number of likes', () => {
    render(<LikesButton count={150} liked={false} itineraryId={'itn123'} />)

    // Check if the heart icon is rendered
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument()

    // Check if the likes count is displayed
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  test('formats likes count in thousands with "k" suffix', () => {
    render(<LikesButton count={1500} liked={false} itineraryId={'itn123'} />)
    expect(screen.getByText('1.5k')).toBeInTheDocument()

    // Test with a value that would give a .0 decimal
    render(<LikesButton count={3000} liked={false} itineraryId={'itn123'} />)
    expect(screen.getByText('3k')).toBeInTheDocument()

    // Test with a value just above 1000
    render(<LikesButton count={1100} liked={false} itineraryId={'itn123'} />)
    expect(screen.getByText('1.1k')).toBeInTheDocument()
  })

  test('applies custom className when provided', () => {
    render(
      <LikesButton
        count={100}
        liked={false}
        itineraryId={'itn123'}
        className="custom-class"
      />
    )

    const likesContainer = screen.getByText('100').closest('div')
    expect(likesContainer).toHaveClass('custom-class')
  })

  test('displays exact number for counts less than 1000', () => {
    render(<LikesButton count={999} liked={false} itineraryId={'itn123'} />)
    expect(screen.getByText('999')).toBeInTheDocument()

    render(<LikesButton count={0} liked={false} itineraryId={'itn123'} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  test('applies correct color when liked is true', () => {
    render(<LikesButton count={100} liked={true} itineraryId={'itn123'} />)

    const heartIcon = screen.getByTestId('heart-icon')
    expect(heartIcon).toHaveStyle('color: red-500')
  })
})
