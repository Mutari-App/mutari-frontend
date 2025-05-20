import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TransactionSection } from '@/modules/ProfileModule/sections/TransactionSection'
import { customFetch } from '@/utils/newCustomFetch'
import { toast } from 'sonner'
import { PAYMENT_STATUS, ProfileProps } from '@/modules/ProfileModule/interface'
import { useRouter } from 'next/navigation'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/utils/newCustomFetch', () => ({
  customFetch: jest.fn(),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('lucide-react', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
}))

jest.mock(
  '@/modules/ProfileModule/module-elements/ItineraryCard/TransactionCard',
  () => ({
    __esModule: true,
    default: ({ transaction }: { transaction: { id: string } }) => (
      <div data-testid="transaction-card" data-transaction-id={transaction.id}>
        Transaction Card
      </div>
    ),
  })
)

describe('TransactionSection Component', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://mutari.com/profile?tab=transactions',
        searchParams: new URLSearchParams('tab=transactions'),
        toString: () => 'https://mutari.com/profile',
      },
      writable: true,
    })
  })

  const mockTransactions = [
    {
      id: 'transaction-1',
      createdAt: '2023-05-15T10:30:00Z',
      quantity: 2,
      totalPrice: 500000,
      paymentStatus: PAYMENT_STATUS.PAID,
      tour: {
        title: 'Bali Adventure Tour',
        location: 'Bali, Indonesia',
      },
      guests: [
        {
          id: 'guest-1',
          title: 'MR',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+6281234567890',
          email: 'john@example.com',
        },
      ],
    },
    {
      id: 'transaction-2',
      createdAt: '2023-06-15T10:30:00Z',
      quantity: 3,
      totalPrice: 750000,
      paymentStatus: PAYMENT_STATUS.UNPAID,
      tour: {
        title: 'Jakarta City Tour',
        location: 'Jakarta, Indonesia',
      },
      guests: [
        {
          id: 'guest-2',
          title: 'MRS',
          firstName: 'Jane',
          lastName: 'Doe',
          phoneNumber: '+6287654321098',
          email: 'jane@example.com',
        },
      ],
    },
  ]

  test('displays loading state initially', () => {
    // Configure mock to delay response to ensure we see loading state
    ;(customFetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ statusCode: 200, transactions: [] }), 100)
        )
    )

    render(<TransactionSection profile={{} as ProfileProps} />)

    // Check for loading indicator
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  test('displays transactions when data is fetched successfully', async () => {
    // Mock successful API response with transactions
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      transactions: mockTransactions,
    })

    render(<TransactionSection profile={{} as ProfileProps} />)

    // Wait for transactions to appear
    await waitFor(() => {
      expect(screen.getAllByTestId('transaction-card')).toHaveLength(2)
    })

    // Check specific transaction data
    expect(screen.getAllByTestId('transaction-card')[0]).toHaveAttribute(
      'data-transaction-id',
      'transaction-1'
    )
  })

  test('displays empty state when no transactions are available', async () => {
    // Mock successful API response with no transactions
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      transactions: [],
    })

    render(<TransactionSection profile={{} as ProfileProps} />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })

    // Check for empty state message
    expect(screen.getByText('Belum ada transaksi')).toBeInTheDocument()
  })

  test('shows error toast when fetching transactions fails', async () => {
    // Mock error response
    const errorMessage = 'Terjadi kesalahan saat mengambil data itineraries'
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 500,
      message: errorMessage,
    })

    render(<TransactionSection profile={{} as ProfileProps} />)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })
  })

  test('shows error toast when API throws an error', async () => {
    // Mock API throwing an error
    ;(customFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    )

    render(<TransactionSection profile={{} as ProfileProps} />)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network error')
    })
  })

  test('processes transactionId and confirms payment on mount', async () => {
    // Mock successful payment confirmation
    ;(customFetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/tour/payment-123/pay') {
        return Promise.resolve({
          statusCode: 200,
          message: 'Payment successful',
        })
      }

      if (url === '/profile/transactions') {
        return Promise.resolve({
          statusCode: 200,
          transactions: mockTransactions,
        })
      }

      return Promise.reject(new Error('Unexpected URL'))
    })

    render(
      <TransactionSection
        profile={{} as ProfileProps}
        transactionId="payment-123"
      />
    )

    // Wait for payment success message
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Pembayaran Berhasil')
    })

    // Check if URL params were updated
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalled()
    })

    // Check if transactions were fetched after payment confirmation
    await waitFor(() => {
      expect(screen.getAllByTestId('transaction-card')).toHaveLength(2)
    })
  })

  test('handles payment confirmation error', async () => {
    const errorMessage = 'Payment processing failed'

    // Mock failed payment confirmation
    ;(customFetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/tour/payment-error/pay') {
        return Promise.resolve({
          statusCode: 400,
          message: errorMessage,
        })
      }

      if (url === '/profile/transactions') {
        return Promise.resolve({
          statusCode: 200,
          transactions: mockTransactions,
        })
      }

      return Promise.reject(new Error('Unexpected URL'))
    })

    render(
      <TransactionSection
        profile={{} as ProfileProps}
        transactionId="payment-error"
      />
    )

    // Wait for error message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })

    // Check if URL params were updated despite error
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalled()
    })

    // Check if transactions were fetched after error
    await waitFor(() => {
      expect(screen.getAllByTestId('transaction-card')).toHaveLength(2)
    })
  })

  test('handles payment API throwing an unexpected error', async () => {
    // Mock API throwing a non-Error object
    ;(customFetch as jest.Mock).mockImplementation((url: string) => {
      if (url === '/tour/payment-unexpected/pay') {
        return Promise.reject(new Error('Unexpected error object'))
      }

      if (url === '/profile/transactions') {
        return Promise.resolve({
          statusCode: 200,
          transactions: mockTransactions,
        })
      }

      return Promise.reject(new Error('Unexpected URL'))
    })

    render(
      <TransactionSection
        profile={{} as ProfileProps}
        transactionId="payment-unexpected"
      />
    )

    // Check if URL params were updated despite error
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalled()
    })
  })

  // This test ensures the double-check for loading state doesn't cause any issues
  test('handles loading state check in renderContent when already loading', () => {
    // Mock a delay in API response
    ;(customFetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ statusCode: 200, transactions: [] }), 100)
        )
    )

    render(<TransactionSection profile={{} as ProfileProps} />)

    // Although the component has an early return for loading state,
    // we still want to verify the renderContent method's loading check works
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })
})
