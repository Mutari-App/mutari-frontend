import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import TransactionDetailModal from '@/modules/ProfileModule/module-elements/ItineraryCard/TransactionDetailModal'
import {
  PAYMENT_STATUS,
  GUEST_TITLE,
  PAYMENT_STATUS_COLOR,
  GUEST_TITLE_DISPLAY,
  type TransactionProps,
} from '@/modules/ProfileModule/interface'

// Mock UI components
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dialog">{children}</div>
  ),
  DialogTrigger: ({
    children,
    className,
  }: React.PropsWithChildren<{ asChild?: boolean; className?: string }>) => (
    <div data-testid="dialog-trigger" className={className}>
      {children}
    </div>
  ),
  DialogContent: ({
    children,
    className,
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
  DialogHeader: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({
    children,
    className,
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="dialog-title" className={className}>
      {children}
    </div>
  ),
}))

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

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    className,
    onClick,
  }: React.PropsWithChildren<{ className?: string; onClick?: () => void }>) => (
    <button data-testid="button" className={className} onClick={onClick}>
      {children}
    </button>
  ),
}))

// Mock PaymentButton component
jest.mock(
  '@/modules/ProfileModule/module-elements/ItineraryCard/PaymentButton',
  () => ({
    PaymentButton: ({ transactionId }: { transactionId: string }) => (
      <div data-testid="payment-button" data-transaction-id={transactionId}>
        Payment Button
      </div>
    ),
  })
)

// Mock NumberFormat for currency
const mockFormatCurrency = jest.fn().mockImplementation(() => 'Rp 500.000')
const originalIntlNumberFormat = Intl.NumberFormat
const mockToLocaleDateString = jest.fn().mockImplementation(() => '15 Mei 2023')

describe('TransactionDetailModal Component', () => {
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

    // Mock the Date.toLocaleDateString
    jest
      .spyOn(Date.prototype, 'toLocaleDateString')
      .mockImplementation(mockToLocaleDateString)
  })

  afterAll(() => {
    // Restore the original implementations
    global.Intl.NumberFormat = originalIntlNumberFormat
    jest.spyOn(Date.prototype, 'toLocaleDateString').mockRestore()
  })

  beforeEach(() => {
    mockFormatCurrency.mockClear()
    mockToLocaleDateString.mockClear()
  })

  test('renders the dialog trigger button', () => {
    render(<TransactionDetailModal transaction={mockTransaction} />)

    const buttonText = screen.getByText('Lihat Detail')
    expect(buttonText).toBeInTheDocument()

    const dialogTrigger = screen.getByTestId('dialog-trigger')
    expect(dialogTrigger).toBeInTheDocument()
    expect(dialogTrigger).toHaveClass('w-full')
    expect(dialogTrigger).toHaveClass('md:w-1/4')
  })

  test('renders dialog content with correct title', () => {
    render(<TransactionDetailModal transaction={mockTransaction} />)

    expect(screen.getByText('Detail Transaksi')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-title')).toHaveClass('text-2xl')
  })

  test('renders transaction details card with tour information', () => {
    render(<TransactionDetailModal transaction={mockTransaction} />)

    // Tour title
    expect(screen.getByText('Bali Adventure Tour')).toBeInTheDocument()

    // ID Pemesanan
    expect(
      screen.getByText(`ID Pemesanan: ${mockTransaction.id}`)
    ).toBeInTheDocument()

    // Date & Price formatting calls
    expect(mockToLocaleDateString).toHaveBeenCalledWith('id-ID', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    expect(global.Intl.NumberFormat).toHaveBeenCalledWith('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    })
    expect(mockFormatCurrency).toHaveBeenCalledWith(500000)
  })

  test('renders guest information correctly', () => {
    render(<TransactionDetailModal transaction={mockTransaction} />)

    // Check section header
    expect(screen.getByText('Detail Partisipan')).toBeInTheDocument()

    // Check guest 1 details
    const guest1Name = `${GUEST_TITLE_DISPLAY[GUEST_TITLE.MR]} ${mockTransaction.guests[0].firstName} ${mockTransaction.guests[0].lastName}`
    expect(screen.getByText(guest1Name)).toBeInTheDocument()
    expect(
      screen.getByText(
        `Nomor Telepon: ${mockTransaction.guests[0].phoneNumber}`
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(`Alamat Email: ${mockTransaction.guests[0].email}`)
    ).toBeInTheDocument()

    // Check guest 2 details
    const guest2Name = `${GUEST_TITLE_DISPLAY[GUEST_TITLE.MRS]} ${mockTransaction.guests[1].firstName} ${mockTransaction.guests[1].lastName}`
    expect(screen.getByText(guest2Name)).toBeInTheDocument()
    expect(
      screen.getByText(
        `Nomor Telepon: ${mockTransaction.guests[1].phoneNumber}`
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(`Alamat Email: ${mockTransaction.guests[1].email}`)
    ).toBeInTheDocument()
  })

  test('renders booking details with correct payment status', () => {
    render(<TransactionDetailModal transaction={mockTransaction} />)

    // Check section header
    expect(screen.getByText('Detail Pemesanan')).toBeInTheDocument()

    // Check quantity
    expect(
      screen.getByText(`${mockTransaction.quantity} orang`)
    ).toBeInTheDocument()

    // Check payment status with proper styling
    const paymentStatus = screen.getByText(
      PAYMENT_STATUS[mockTransaction.paymentStatus]
    )
    expect(paymentStatus).toBeInTheDocument()
    expect(paymentStatus).toHaveClass(
      PAYMENT_STATUS_COLOR[mockTransaction.paymentStatus]
    )
  })

  test('renders refund policy section', () => {
    render(<TransactionDetailModal transaction={mockTransaction} />)

    // Check section header
    expect(screen.getByText('Kebijakan Pengembalian')).toBeInTheDocument()

    // Check policy text
    expect(
      screen.getByText(
        /Penjadwalan ulang hanya dapat dilakukan 1 \(satu\) kali/
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText('Kontak kami: support@mutari.id')
    ).toBeInTheDocument()
  })

  test('handles transaction with different payment status', () => {
    const unpaidTransaction = {
      ...mockTransaction,
      paymentStatus: PAYMENT_STATUS.UNPAID,
    }

    render(<TransactionDetailModal transaction={unpaidTransaction} />)

    // Check payment status shows UNPAID with correct styling
    const paymentStatus = screen.getByText(
      PAYMENT_STATUS[PAYMENT_STATUS.UNPAID]
    )
    expect(paymentStatus).toBeInTheDocument()
    expect(paymentStatus).toHaveClass(
      PAYMENT_STATUS_COLOR[PAYMENT_STATUS.UNPAID]
    )
  })

  test('shows payment button only for UNPAID transactions', () => {
    // For UNPAID transaction
    const unpaidTransaction = {
      ...mockTransaction,
      paymentStatus: PAYMENT_STATUS.UNPAID,
    }

    const { rerender } = render(
      <TransactionDetailModal transaction={unpaidTransaction} />
    )

    // Payment button should be visible
    expect(screen.getByTestId('payment-button')).toBeInTheDocument()
    expect(
      screen.getByTestId('payment-button').getAttribute('data-transaction-id')
    ).toBe(unpaidTransaction.id)

    // For PAID transaction
    rerender(<TransactionDetailModal transaction={mockTransaction} />)

    // Payment button should not be visible
    expect(screen.queryByTestId('payment-button')).not.toBeInTheDocument()
  })

  test('handles transaction with a single guest', () => {
    const singleGuestTransaction = {
      ...mockTransaction,
      guests: [mockTransaction.guests[0]], // Only include the first guest
      quantity: 1,
    }

    render(<TransactionDetailModal transaction={singleGuestTransaction} />)

    // Should only show one guest
    expect(screen.getByText('1 orang')).toBeInTheDocument()
    expect(
      screen.getByText(`${GUEST_TITLE_DISPLAY[GUEST_TITLE.MR]} John Doe`)
    ).toBeInTheDocument()

    // Second guest shouldn't be present
    const guest2Name = `${GUEST_TITLE_DISPLAY[GUEST_TITLE.MRS]} Jane Doe`
    expect(screen.queryByText(guest2Name)).not.toBeInTheDocument()
  })

  test('renders modal with the correct responsive classes', () => {
    render(<TransactionDetailModal transaction={mockTransaction} />)

    const dialogContent = screen.getByTestId('dialog-content')
    expect(dialogContent).toHaveClass('md:max-w-[70%]')
    expect(dialogContent).toHaveClass('lg:max-w-[60%]')
    expect(dialogContent).toHaveClass('xl:max-w-[40%]')
    expect(dialogContent).toHaveClass('max-h-[80dvh]')
    expect(dialogContent).toHaveClass('mt-10')
  })
})
