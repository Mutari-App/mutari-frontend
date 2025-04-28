import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import FilterButton from '@/modules/ItinerarySearchResultsModule/module-elements/FilterButton'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  SlidersHorizontal: () => <div data-testid="sliders-icon">SlidersIcon</div>,
}))

describe('FilterButton Component', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders correctly without filters applied', () => {
    const { container } = render(
      <FilterButton onClick={mockOnClick} filtersApplied={false} />
    )

    // Check if the button is rendered
    const button = screen.getByRole('button', { name: /open filters/i })
    expect(button).toBeInTheDocument()

    // Check if the icon is rendered
    expect(screen.getByTestId('sliders-icon')).toBeInTheDocument()

    // The notification dot should not be visible
    expect(container.querySelector('.bg-red-500')).not.toBeInTheDocument()
  })

  test('renders correctly with filters applied', () => {
    const { container } = render(
      <FilterButton onClick={mockOnClick} filtersApplied={true} />
    )

    // The button should be present
    const button = screen.getByRole('button', { name: /open filters/i })
    expect(button).toBeInTheDocument()

    // The notification dot should be visible
    expect(container.querySelector('.bg-red-500')).toBeInTheDocument()
  })

  test('calls onClick when button is clicked', () => {
    render(<FilterButton onClick={mockOnClick} filtersApplied={false} />)

    const button = screen.getByRole('button', { name: /open filters/i })
    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  test('applies the correct styling classes', () => {
    render(<FilterButton onClick={mockOnClick} filtersApplied={false} />)

    const button = screen.getByRole('button', { name: /open filters/i })
    expect(button).toHaveClass('text-white')
    expect(button).toHaveClass('hover:text-white')
    expect(button).toHaveClass('rounded-full')
    expect(button).toHaveClass('bg-gradient-to-r')
  })
})
