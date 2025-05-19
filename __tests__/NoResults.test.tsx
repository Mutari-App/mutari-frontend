import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import NoResults from '@/components/NoResults'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">SearchIcon</div>,
  RefreshCw: () => <div data-testid="refresh-icon">RefreshIcon</div>,
}))

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({
    onClick,
    variant,
    className,
    children,
  }: React.PropsWithChildren<{
    onClick: () => void
    variant: string
    className: string
  }>) => (
    <button
      onClick={onClick}
      data-variant={variant}
      className={className}
      data-testid="reset-button"
    >
      {children}
    </button>
  ),
}))

describe('NoResults Component', () => {
  const mockOnReset = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders correctly with a search query', () => {
    const searchQuery = 'Bali trip'
    render(<NoResults query={searchQuery} onReset={mockOnReset} />)

    // Check if icons are rendered
    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    expect(screen.getByTestId('refresh-icon')).toBeInTheDocument()

    // Check if the title is rendered
    expect(screen.getByText('Tidak ada hasil ditemukan')).toBeInTheDocument()

    // Check if the message includes the search query
    const message = screen.getByText(
      /Kami tidak dapat menemukan itinerary yang cocok dengan "Bali trip"/
    )
    expect(message).toBeInTheDocument()

    // Check if the reset button is rendered
    const resetButton = screen.getByText('Reset Pencarian')
    expect(resetButton).toBeInTheDocument()
  })

  test('renders correctly without a search query', () => {
    render(<NoResults query="" onReset={mockOnReset} />)

    // Check if the title is rendered
    expect(screen.getByText('Tidak ada hasil ditemukan')).toBeInTheDocument()

    // Check if the alternative message is shown when no query is provided
    const message = screen.getByText(
      /Tidak ada itinerary yang cocok dengan filter saat ini/
    )
    expect(message).toBeInTheDocument()
  })

  test('calls onReset when reset button is clicked', () => {
    render(<NoResults query="test" onReset={mockOnReset} />)

    const resetButton = screen.getByTestId('reset-button')
    fireEvent.click(resetButton)

    expect(mockOnReset).toHaveBeenCalledTimes(1)
  })
})
