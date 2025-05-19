import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TourBookingFormModule } from '@/modules/TourBookingFormModule'
import { toast } from 'sonner'
import { act } from 'react-dom/test-utils'
import * as newCustomFetch from '@/utils/newCustomFetch'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}))

// Mock useRouter
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock AuthContext
const mockUser = { id: 'user-123', name: 'Test User' }
jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: () => ({
    user: mockUser,
  }),
}))

// Mock getImage utility
jest.mock('@/utils/getImage', () => ({
  getImage: jest.fn().mockReturnValue('/images/no-image.png'),
}))

// Mock customFetch
jest.mock('@/utils/newCustomFetch', () => ({
  customFetch: jest.fn().mockResolvedValue({
    id: 'transaction-123',
    statusCode: 201,
  }),
  customFetchBody: (data: any) => JSON.stringify(data),
}))

// Mock createPaymentDoku
jest.mock('@/app/actions/paymentDoku', () => ({
  createPaymentDoku: jest.fn().mockResolvedValue({
    success: true,
    token: 'payment-token-123',
  }),
}))

// Mock DOKU script
jest.mock('@/modules/TourBookingFormModule/components/DokuScript', () => ({
  DokuScript: ({ clientId }: { clientId: string }) => (
    <div data-testid="doku-script">{clientId}</div>
  ),
}))

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  return new Proxy(
    {
      __esModule: true,
    },
    {
      get: function (_, prop) {
        if (prop === '__esModule') return true
        return () => (
          <div data-testid={`icon-${String(prop)}`}>{String(prop)}</div>
        )
      },
    }
  )
})

// Mock window.loadJokulCheckout
global.window.loadJokulCheckout = jest.fn()

describe('TourBookingFormModule', () => {
  const mockProps = {
    tourDetail: {
      id: 'tour-123',
      title: 'Open Trip Baduy 2D1N',
      description: 'Amazing tour to Baduy',
      pricePerTicket: 250000,
      coverImage: '/images/tour-cover.jpg',
      maxCapacity: 20,
      location: 'Baduy',
      duration: 2,
      durationType: 'DAY' as const,
      maxGuestPerBooking: 10,
      minGuestPerBooking: 1,
      itineraryId: 'itinerary-123',
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    },
    guests: 2,
    tourDate: new Date('2025-06-15'),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('validates form inputs and shows error messages', async () => {
    render(<TourBookingFormModule {...mockProps} />)

    // Click submit button without filling the form
    const submitButton = screen.getByRole('button', {
      name: /Lanjut ke Pembayaran/i,
    })
    await act(async () => {
      await userEvent.click(submitButton)
    })

    // Check for error messages
    await waitFor(() => {
      expect(screen.getAllByText('Title is required').length).toBe(3)
      expect(screen.getAllByText('First name is required').length).toBe(3)
      expect(screen.getAllByText('Last name is required').length).toBe(3)
      expect(
        screen.getAllByText('Phone number must be at least 10 digits').length
      ).toBe(3)
      expect(
        screen.getAllByText('Please enter a valid email address').length
      ).toBe(3)
    })
  })
})
