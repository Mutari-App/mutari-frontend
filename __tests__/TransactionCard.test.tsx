import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import TransactionCard from '@/modules/ProfileModule/module-elements/ItineraryCard/TransactionCard'
import {
  PAYMENT_STATUS,
  GUEST_TITLE,
  type TransactionProps,
} from '@/modules/ProfileModule/interface'

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
  CardHeader: ({
    children,
    className,
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="card-header" className={className}>
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

// Mock Separator component
jest.mock('@/components/ui/separator', () => ({
  Separator: ({
    className,
    decorative,
  }: {
    className?: string
    decorative?: boolean
  }) => (
    <hr
      data-testid="separator"
      className={className}
      data-decorative={decorative ? 'true' : 'false'}
    />
  ),
}))

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Earth: ({ size }: { size?: number }) => (
    <div data-testid="earth-icon" data-size={size} />
  ),
  User: ({
    size,
    className,
    fill,
  }: {
    size?: number
    className?: string
    fill?: string
  }) => (
    <div
      data-testid="user-icon"
      data-size={size}
      className={className}
      data-fill={fill}
    />
  ),
  Calendar: ({ size, className }: { size?: number; className?: string }) => (
    <div data-testid="calendar-icon" data-size={size} className={className} />
  ),
}))

// Mock TransactionDetailModal component
jest.mock(
  '@/modules/ProfileModule/module-elements/ItineraryCard/TransactionDetailModal',
  () => ({
    __esModule: true,
    default: ({ transaction }: { transaction: TransactionProps }) => (
      <div
        data-testid="transaction-detail-modal"
        data-transaction-id={transaction.id}
      >
        Detail Modal
      </div>
    ),
  })
)

// Mock NumberFormat for currency
const mockFormatCurrency = jest.fn().mockImplementation(() => 'Rp 500.000')
const originalIntlNumberFormat = Intl.NumberFormat

describe('TransactionCard Component', () => {
  const mockTransaction: TransactionProps = {
    id: 'transaction-123',
    createdAt: '2023-05-15T10:30:00Z',
    quantity: 2,
    paymentStatus: PAYMENT_STATUS.PAID,
    totalPrice: 500000,
    tour: {
      title: 'Bali Adventure Tour',
      location: 'Bali, Indonesia',
    },
    guests: [
      {
        id: 'guest-1',
        title: GUEST_TITLE.MR,
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+6281234567890',
        email: 'john@example.com',
      },
      {
        id: 'guest-2',
        title: GUEST_TITLE.MRS,
        firstName: 'Jane',
        lastName: 'Doe',
        phoneNumber: '+6287654321098',
        email: 'jane@example.com',
      },
    ],
  }

  beforeAll(() => {
    // Mock the Intl.NumberFormat
    global.Intl.NumberFormat = jest.fn().mockImplementation(() => ({
      format: mockFormatCurrency,
    })) as unknown as typeof Intl.NumberFormat

    // Add the required supportedLocalesOf method
    global.Intl.NumberFormat.supportedLocalesOf = jest
      .fn()
      .mockImplementation(() => [])
  })

  afterAll(() => {
    // Restore the original implementation
    global.Intl.NumberFormat = originalIntlNumberFormat
  })

  beforeEach(() => {
    mockFormatCurrency.mockClear()
  })

  test('renders transaction card with correct data', () => {
    render(<TransactionCard transaction={mockTransaction} />)

    // Check header content
    expect(screen.getByText('Bali, Indonesia')).toBeInTheDocument()
    expect(screen.getByText(`ID: ${mockTransaction.id}`)).toBeInTheDocument()

    // Check card content
    expect(screen.getByText('Bali Adventure Tour')).toBeInTheDocument()
    expect(screen.getByText(/2.*orang/)).toBeInTheDocument()

    // Check for the Indonesian formatted date instead
    expect(screen.getByText(/15 Mei 2023/)).toBeInTheDocument()

    // Check price formatting
    expect(screen.getByText('Total Harga:')).toBeInTheDocument()
    expect(mockFormatCurrency).toHaveBeenCalledWith(500000)
  })

  test('handles transaction with different payment status', () => {
    const pendingTransaction = {
      ...mockTransaction,
      paymentStatus: PAYMENT_STATUS.UNPAID,
    }

    render(<TransactionCard transaction={pendingTransaction} />)

    // Core transaction data should still be displayed
    expect(screen.getByText('Bali Adventure Tour')).toBeInTheDocument()
    expect(screen.getByText(/2.*orang/)).toBeInTheDocument()
  })

  test('renders responsive layout with expected classes', () => {
    render(<TransactionCard transaction={mockTransaction} />)

    // Check responsive classes on card content
    const cardContent = screen.getByTestId('card-content')
    expect(cardContent.className).toContain('flex-col')

    // Check responsive classes on separator
    const separator = screen.getByTestId('separator')
    expect(separator.className).toContain('w-full')
    expect(separator.className).toContain('md:w-px')
  })
})
