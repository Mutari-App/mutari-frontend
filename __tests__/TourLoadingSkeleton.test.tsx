// LoadingSkeleton.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoadingSkeleton from '@/modules/TourSearchResultsModule/module-elements/LoadingSkeleton'

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
}))

jest.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className}></div>
  ),
}))

describe('LoadingSkeleton Component', () => {
  test('renders the default number of skeleton cards when no count provided', () => {
    render(<LoadingSkeleton />)

    // Default count is 6
    expect(screen.getAllByTestId('card')).toHaveLength(6)
  })

  test('renders the specified number of skeleton cards', () => {
    render(<LoadingSkeleton count={3} />)

    // Check if exactly 3 cards are rendered
    expect(screen.getAllByTestId('card')).toHaveLength(3)
  })

  test('renders the correct structure of skeleton elements', () => {
    render(<LoadingSkeleton count={1} />)

    const card = screen.getByTestId('card')
    const cardContent = screen.getByTestId('card-content')

    // Card should contain card content
    expect(card).toContainElement(cardContent)

    // Should have multiple skeleton elements
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons.length).toBeGreaterThan(1)

    // Card should have the proper styling
    expect(card).toHaveClass('overflow-hidden')
  })
})
