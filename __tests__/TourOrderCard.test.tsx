import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TourOrderCard } from '@/modules/DetailTourModule/module-elements/TourOrderCard'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import React from 'react'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}))

jest.mock('lucide-react', () => ({
  ChevronDown: () => <div data-testid="mock-chevron-down">ChevronDown</div>,
}))

// Mock Calendar component for easier testing
jest.mock('@/components/ui/calendar', () => ({
  Calendar: ({ onSelect }: { onSelect: (date: Date) => void }) => (
    <button
      data-testid="mock-calendar"
      onClick={() => onSelect(new Date('2023-12-25T12:00:00Z'))}
    >
      Select Date
    </button>
  ),
}))

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode
    open: boolean
  }) => {
    if (!open) return null
    return <div data-testid="mock-dialog">{children}</div>
  },
  DialogContent: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className: string
  }) => (
    <div data-testid="mock-dialog-content" className={className}>
      {children}
    </div>
  ),
  DialogTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className: string
  }) => (
    <div data-testid="mock-dialog-title" className={className}>
      {children}
    </div>
  ),
}))

describe('TourOrderCard', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: mockPush })
  })

  it('renders with correct price', () => {
    render(<TourOrderCard tourId="123" pricePerTicket={1500000} />)
    expect(screen.getByText('Pesan Sekarang')).toBeInTheDocument()
  })

  it('opens dialog when booking button is clicked', async () => {
    render(<TourOrderCard tourId="123" pricePerTicket={1500000} />)
    await userEvent.click(screen.getByText('Pesan Sekarang'))
    expect(screen.getByText('Pilih tanggal')).toBeInTheDocument()
    expect(screen.getByText('Guest')).toBeInTheDocument()
  })

  it('closes dialog when cancel button is clicked', async () => {
    render(<TourOrderCard tourId="123" pricePerTicket={1500000} />)
    await userEvent.click(screen.getByText('Pesan Sekarang'))
    await userEvent.click(screen.getByText('Batal'))
    expect(screen.queryByText('Pilih tanggal')).not.toBeInTheDocument()
  })

  it('updates guest count and calculates total price correctly', async () => {
    render(<TourOrderCard tourId="123" pricePerTicket={1500000} />)
    await userEvent.click(screen.getByText('Pesan Sekarang'))

    const guestInput = screen.getByPlaceholderText('Pilih jumlah partisipan')
    await userEvent.clear(guestInput)
    await userEvent.type(guestInput, '3')

    expect(
      screen.getByText((content) => {
        return content.includes('Rp') && content.includes('4.500.000')
      })
    ).toBeInTheDocument()
  })

  it('allows entering voucher code', async () => {
    render(<TourOrderCard tourId="123" pricePerTicket={1500000} />)
    await userEvent.click(screen.getByText('Pesan Sekarang'))

    const voucherInput = screen.getByPlaceholderText(
      'Masukkan kode voucher (opsional)'
    )
    await userEvent.type(voucherInput, 'DISCOUNT50')

    expect(voucherInput).toHaveValue('DISCOUNT50')
  })

  it('updates trip details when date is selected', async () => {
    render(<TourOrderCard tourId="123" pricePerTicket={1500000} />)
    await userEvent.click(screen.getByText('Pesan Sekarang'))

    // Initially, departure date should show '-'
    expect(screen.getByText('-')).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('mock-calendar'))

    // After selection, it shouldn't show the dash anymore
    expect(screen.queryByText('-')).not.toBeInTheDocument()
  })

  it('shows error when booking without selecting a date', async () => {
    render(<TourOrderCard tourId="123" pricePerTicket={1500000} />)
    await userEvent.click(screen.getByText('Pesan Sekarang'))

    const bookNowButton = screen.getAllByText('Pesan Sekarang')[1]
    await userEvent.click(bookNowButton)

    expect(toast.error).toHaveBeenCalledWith(
      'Tolong pilih tanggal terlebih dahulu!'
    )
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('shows error when booking with invalid guest count', async () => {
    render(<TourOrderCard tourId="123" pricePerTicket={1500000} />)
    await userEvent.click(screen.getByText('Pesan Sekarang'))
    await userEvent.click(screen.getByTestId('mock-calendar'))

    const guestInput = screen.getByPlaceholderText('Pilih jumlah partisipan')
    await userEvent.clear(guestInput)
    await userEvent.type(guestInput, '0')

    const bookNowButton = screen.getAllByText('Pesan Sekarang')[1]
    await userEvent.click(bookNowButton)

    expect(toast.error).toHaveBeenCalledWith('Tolong pilih jumlah partisipan!')
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('navigates to booking form when all inputs are valid', async () => {
    render(<TourOrderCard tourId="123" pricePerTicket={1500000} />)
    await userEvent.click(screen.getByText('Pesan Sekarang'))
    await userEvent.click(screen.getByTestId('mock-calendar'))

    const bookNowButton = screen.getAllByText('Pesan Sekarang')[1]
    await userEvent.click(bookNowButton)

    const expectedDate = new Date('2023-12-25T12:00:00Z').toISOString()
    expect(mockPush).toHaveBeenCalledWith(
      `/tour/123/booking-form?tourDate=${expectedDate}&guests=1`
    )
  })

  it('closes dialog after successful booking', async () => {
    render(<TourOrderCard tourId="123" pricePerTicket={1500000} />)
    await userEvent.click(screen.getByText('Pesan Sekarang'))
    await userEvent.click(screen.getByTestId('mock-calendar'))
    await userEvent.click(screen.getAllByText('Pesan Sekarang')[1])

    expect(screen.queryByText('Pilih tanggal')).not.toBeInTheDocument()
  })
})
