import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoadingSkeleton from '@/components/LoadingSkeleton'

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
  CardContent: ({ children }: React.PropsWithChildren<object>) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardFooter: ({ children }: React.PropsWithChildren<object>) => (
    <div data-testid="card-footer">{children}</div>
  ),
}))

jest.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className}></div>
  ),
}))

describe('LoadingSkeleton Component', () => {
  test('renders the default number (6) of skeleton cards', () => {
    render(<LoadingSkeleton />)

    // Check if 6 cards are rendered
    expect(screen.getAllByTestId('card')).toHaveLength(6)

    // Check if each card has the correct structure
    const cards = screen.getAllByTestId('card')
    cards.forEach((card) => {
      expect(card).toHaveClass('h-full')
      expect(card).toHaveClass('overflow-hidden')
    })
  })

  test('renders the specified number of skeleton cards', () => {
    render(<LoadingSkeleton count={3} />)

    // Check if exactly 3 cards are rendered
    expect(screen.getAllByTestId('card')).toHaveLength(3)
  })

  test('renders the correct number of skeletons within each card', () => {
    render(<LoadingSkeleton count={1} />)

    // One card should have multiple skeleton elements
    const card = screen.getByTestId('card')
    const cardContent = screen.getByTestId('card-content')
    const cardFooter = screen.getByTestId('card-footer')

    // There should be skeleton elements in the card
    const skeletons = screen.getAllByTestId('skeleton')

    // Main image skeleton + title + date + 2 lines of text + avatar + name + likes
    expect(skeletons.length).toBeGreaterThan(5)

    // Check if the card has the correct structure
    expect(card).toContainElement(cardContent)
    expect(card).toContainElement(cardFooter)
  })
})
