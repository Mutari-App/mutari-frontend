import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SubmitOtpForm } from '../src/modules/ProfileModule/module-elements/SubmitOtpForm'
import { customFetch } from '@/utils/newCustomFetch'
import { toast } from 'sonner'

// Mock the dependencies
jest.mock('@/utils/newCustomFetch', () => ({
  customFetch: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  customFetchBody: (data: any) => data,
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock the Lucide icons
jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
  Loader: () => <div data-testid="loader-icon" />,
}))

describe('SubmitOtpForm', () => {
  const mockProps = {
    closeDialog: jest.fn(),
    backButtonHandler: jest.fn(),
    newEmail: 'test@example.com',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly and handles back button click', async () => {
    const user = userEvent.setup()
    render(<SubmitOtpForm {...mockProps} />)

    // Check form renders correctly
    expect(screen.getByLabelText(/kode otp/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/masukkan kode otp/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/kembali/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /verifikasi email/i })
    ).toBeInTheDocument()

    // Test back button
    await user.click(screen.getByText(/kembali/i))
    expect(mockProps.backButtonHandler).toHaveBeenCalledTimes(1)
  })

  it('shows validation error for invalid OTP input', async () => {
    const user = userEvent.setup()
    render(<SubmitOtpForm {...mockProps} />)

    // Enter invalid OTP (wrong length)
    await user.type(screen.getByLabelText(/kode otp/i), '1234')

    // Submit the form
    await user.click(screen.getByRole('button', { name: /verifikasi email/i }))

    // Check validation error message
    expect(
      await screen.findByText(/kode otp harus 8 digit/i)
    ).toBeInTheDocument()
  })

  it('handles successful form submission', async () => {
    const user = userEvent.setup()
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      message: 'Success',
    })

    render(<SubmitOtpForm {...mockProps} />)

    // Enter valid OTP
    await user.type(screen.getByLabelText(/kode otp/i), '12345678')

    // Submit the form
    await user.click(screen.getByRole('button', { name: /verifikasi email/i }))

    // Verify API was called correctly
    await waitFor(() => {
      expect(customFetch).toHaveBeenCalledWith(
        '/profile/email/change-verification',
        {
          method: 'POST',
          body: { code: '12345678' },
        }
      )
      expect(toast.success).toHaveBeenCalledWith('Email berhasil diubah')
      expect(mockProps.closeDialog).toHaveBeenCalledTimes(1)
    })
  })

  it('handles API error responses', async () => {
    const user = userEvent.setup()
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 400,
      message: 'Invalid OTP code',
    })

    render(<SubmitOtpForm {...mockProps} />)

    await user.type(screen.getByLabelText(/kode otp/i), '12345678')
    await user.click(screen.getByRole('button', { name: /verifikasi email/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid OTP code')
    })
  })

  it('handles Error exceptions during submission', async () => {
    const user = userEvent.setup()
    ;(customFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    )

    render(<SubmitOtpForm {...mockProps} />)

    await user.type(screen.getByLabelText(/kode otp/i), '12345678')
    await user.click(screen.getByRole('button', { name: /verifikasi email/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Network error')
    })
  })

  it('handles non-Error exceptions during submission', async () => {
    const user = userEvent.setup()
    ;(customFetch as jest.Mock).mockRejectedValueOnce('Some unknown error')

    render(<SubmitOtpForm {...mockProps} />)

    await user.type(screen.getByLabelText(/kode otp/i), '12345678')
    await user.click(screen.getByRole('button', { name: /verifikasi email/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Terjadi kesalahan, silakan coba lagi'
      )
    })
  })
})
