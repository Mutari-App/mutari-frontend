import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PaymentButton } from '@/modules/ProfileModule/module-elements/ItineraryCard/PaymentButton'
import { resumePayment } from '@/app/actions/resumePayment'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: jest.fn(),
}))

jest.mock('@/app/actions/resumePayment', () => ({
  resumePayment: jest.fn(),
}))

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
  },
}))

jest.mock('@/modules/TourBookingFormModule/components/MidtransScript', () => ({
  MidtransScript: () => <div data-testid="midtrans-script" />,
}))

describe('PaymentButton Component', () => {
  const mockProps = {
    transactionId: 'txn-123',
    totalPrice: 500000,
    quantity: 2,
    tourId: 'tour-456',
    tourName: 'Bali Tour',
    guests: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '081234567890',
      },
      {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phoneNumber: '087654321098',
      },
    ],
  }

  const mockUser = {
    id: 'user-789',
    firstName: 'John',
    lastName: 'Doe',
  }

  const mockRouter = {
    refresh: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useAuthContext as jest.Mock).mockReturnValue({ user: mockUser })
  })

  test('renders the payment button correctly', () => {
    render(<PaymentButton {...mockProps} />)

    expect(screen.getByText('Bayar Sekarang')).toBeInTheDocument()
    expect(screen.getByTestId('midtrans-script')).toBeInTheDocument()
  })

  test('shows error toast when user is not logged in', async () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({ user: null })

    render(<PaymentButton {...mockProps} />)

    fireEvent.click(screen.getByText('Bayar Sekarang'))

    expect(toast.error).toHaveBeenCalledWith('Anda harus login terlebih dahulu')
    expect(resumePayment).not.toHaveBeenCalled()
  })

  test('calls resumePayment with correct parameters when clicked', async () => {
    ;(resumePayment as jest.Mock).mockResolvedValue({
      success: true,
      token: 'snap-token-123',
      orderId: 'order-123',
    })

    render(<PaymentButton {...mockProps} />)

    fireEvent.click(screen.getByText('Bayar Sekarang'))

    await waitFor(() => {
      expect(resumePayment).toHaveBeenCalledWith({
        userId: mockUser.id,
        transactionId: mockProps.transactionId,
        totalPrice: mockProps.totalPrice,
        quantity: mockProps.quantity,
        customerFirstName: mockProps.guests[0].firstName,
        customerLastName: mockProps.guests[0].lastName,
        customerEmail: mockProps.guests[0].email,
        customerPhone: mockProps.guests[0].phoneNumber,
        tourId: mockProps.tourId,
        tourName: mockProps.tourName,
      })
    })
  })

  test('shows error toast when resumePayment fails', async () => {
    const errorMessage = 'Failed to process payment'
    ;(resumePayment as jest.Mock).mockResolvedValue({
      success: false,
      error: errorMessage,
    })

    render(<PaymentButton {...mockProps} />)

    fireEvent.click(screen.getByText('Bayar Sekarang'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })
  })

  test('shows loading state while processing payment', async () => {
    // Create a promise that never resolves to keep loading state
    ;(resumePayment as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          // Intentionally not resolved to test loading state
        })
    )

    render(<PaymentButton {...mockProps} />)

    fireEvent.click(screen.getByText('Bayar Sekarang'))

    await waitFor(() => {
      expect(screen.getByText('Memproses...')).toBeInTheDocument()
    })
  })
})
