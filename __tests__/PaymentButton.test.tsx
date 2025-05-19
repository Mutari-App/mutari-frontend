import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PaymentButton } from '@/modules/ProfileModule/module-elements/ItineraryCard/PaymentButton'
import { resumePaymentDoku } from '@/app/actions/resumePaymentDoku'
import { toast } from 'sonner'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

jest.mock('@/app/actions/resumePaymentDoku')
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
  },
}))

jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock DokuScript component
jest.mock('@/modules/TourBookingFormModule/components/DokuScript', () => ({
  __esModule: true,
  DokuScript: () => <div data-testid="doku-script"></div>,
}))

describe('PaymentButton', () => {
  // Mock payment data
  const mockProps = {
    transactionId: 'test-transaction-id',
    totalPrice: 100000,
    quantity: 2,
    tourId: 'test-tour-id',
    tourName: 'Test Tour',
    guests: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '081234567890',
      },
    ],
  }

  // Mock user context
  const mockUser = { id: 'user-123' }
  const mockUseAuthContext = useAuthContext as jest.Mock
  const mockUseRouter = useRouter as jest.Mock

  // Mock window methods
  const mockLoadJokulCheckout = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup auth context mock
    mockUseAuthContext.mockReturnValue({ user: mockUser })
    mockUseRouter.mockReturnValue({ push: jest.fn(), refresh: jest.fn() })

    // Setup window mocks
    global.window.loadJokulCheckout = mockLoadJokulCheckout

    // Mock document.querySelector
    document.querySelector = jest.fn().mockImplementation((selector) => {
      return {
        setAttribute: jest.fn(),
        removeAttribute: jest.fn(),
      }
    })
  })

  it('renders the payment button correctly', () => {
    render(<PaymentButton {...mockProps} />)

    expect(screen.getByText('Bayar Sekarang')).toBeInTheDocument()
    expect(screen.getByTestId('doku-script')).toBeInTheDocument()
  })

  it('shows loading state when clicked', async () => {
    // Mock the resumePaymentDoku to delay returning
    ;(resumePaymentDoku as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true, token: 'token-123' }), 100)
        )
    )

    render(<PaymentButton {...mockProps} />)

    fireEvent.click(screen.getByText('Bayar Sekarang'))

    expect(screen.getByText('Memproses...')).toBeInTheDocument()
  })

  it('calls resumePaymentDoku with correct parameters when clicked', async () => {
    ;(resumePaymentDoku as jest.Mock).mockResolvedValue({
      success: true,
      token: 'test-token',
    })

    render(<PaymentButton {...mockProps} />)

    fireEvent.click(screen.getByText('Bayar Sekarang'))

    await waitFor(() => {
      expect(resumePaymentDoku).toHaveBeenCalledWith({
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

  it('shows error toast when user is not logged in', () => {
    mockUseAuthContext.mockReturnValue({ user: null })

    render(<PaymentButton {...mockProps} />)

    fireEvent.click(screen.getByText('Bayar Sekarang'))

    expect(toast.error).toHaveBeenCalledWith('Anda harus login terlebih dahulu')
  })

  it('calls loadJokulCheckout when payment token is received', async () => {
    ;(resumePaymentDoku as jest.Mock).mockResolvedValue({
      success: true,
      token: 'test-token',
    })

    render(<PaymentButton {...mockProps} />)

    fireEvent.click(screen.getByText('Bayar Sekarang'))

    await waitFor(() => {
      expect(mockLoadJokulCheckout).toHaveBeenCalledWith('test-token')
    })
  })

  it('shows error toast when resumePaymentDoku fails', async () => {
    ;(resumePaymentDoku as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Payment failed',
    })

    render(<PaymentButton {...mockProps} />)

    fireEvent.click(screen.getByText('Bayar Sekarang'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Payment failed')
    })
  })

  it('shows generic error toast when resumePaymentDoku throws an error', async () => {
    ;(resumePaymentDoku as jest.Mock).mockRejectedValue(
      new Error('Network error')
    )

    render(<PaymentButton {...mockProps} />)

    fireEvent.click(screen.getByText('Bayar Sekarang'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network error')
    })
  })

  it('shows generic error toast when resumePaymentDoku throws a non-Error exception', async () => {
    ;(resumePaymentDoku as jest.Mock).mockRejectedValue('Something went wrong')

    render(<PaymentButton {...mockProps} />)

    fireEvent.click(screen.getByText('Bayar Sekarang'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.'
      )
    })
  })

  it('hides dialog overlay when payment token is received', async () => {
    const mockSetAttribute = jest.fn()
    const mockedQuerySelector = jest.fn().mockImplementation(() => ({
      setAttribute: mockSetAttribute,
    }))
    document.querySelector = mockedQuerySelector
    ;(resumePaymentDoku as jest.Mock).mockResolvedValue({
      success: true,
      token: 'test-token',
    })

    render(<PaymentButton {...mockProps} />)

    fireEvent.click(screen.getByText('Bayar Sekarang'))

    await waitFor(() => {
      expect(mockedQuerySelector).toHaveBeenCalled()
      expect(mockSetAttribute).toHaveBeenCalledWith(
        'style',
        'visibility: hidden; opacity: 0;'
      )
    })
  })

  it('disables the button when loading', () => {
    ;(resumePaymentDoku as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 1000)
        )
    )

    render(<PaymentButton {...mockProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(button).toBeDisabled()
  })

  it('re-enables the button after payment fails', async () => {
    ;(resumePaymentDoku as jest.Mock).mockRejectedValue(
      new Error('Payment failed')
    )

    render(<PaymentButton {...mockProps} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(button).not.toBeDisabled()
    })
  })
})
