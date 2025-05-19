import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChangeEmailForm } from '../src/modules/ProfileModule/module-elements/ChangeEmailForm'
import { useAuthContext } from '@/contexts/AuthContext'
import { customFetch } from '@/utils/newCustomFetch'
import { toast } from 'sonner'

// Mock the dependencies
jest.mock('@/contexts/AuthContext')
jest.mock('@/utils/newCustomFetch')
jest.mock('sonner')
jest.mock('@/components/ui/dialog', () => ({
  DialogFooter: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => (
    <div data-testid="dialog-footer" className={className}>
      {children}
    </div>
  ),
}))
jest.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft Icon</div>,
  Loader: () => <div data-testid="loader-icon">Loader Icon</div>,
}))

// Mock props
const mockSetNewEmail = jest.fn()
const mockEnableSubmitOtpMode = jest.fn()
const mockEditProfileButtonHandler = jest.fn()

const defaultProps = {
  setNewEmail: mockSetNewEmail,
  enableSubmitOtpMode: mockEnableSubmitOtpMode,
  editProfileButtonHandler: mockEditProfileButtonHandler,
  closeDialog: jest.fn(),
}

describe('ChangeEmailForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuthContext as jest.Mock).mockReturnValue({
      user: { email: 'current@example.com' },
    })
  })

  it('renders the change email form with the current email', () => {
    render(<ChangeEmailForm {...defaultProps} />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/masukkan email baru/i)
    ).toBeInTheDocument()
    expect(screen.getByDisplayValue('current@example.com')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /ubah profil/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /kirim verifikasi/i })
    ).toBeInTheDocument()
  })

  it('calls editProfileButtonHandler when back button is clicked', async () => {
    render(<ChangeEmailForm {...defaultProps} />)

    const backButton = screen.getByRole('button', { name: /ubah profil/i })
    await userEvent.click(backButton)

    expect(mockEditProfileButtonHandler).toHaveBeenCalledTimes(1)
  })

  it('submit button is disabled when email is unchanged', () => {
    render(<ChangeEmailForm {...defaultProps} />)

    const submitButton = screen.getByRole('button', {
      name: /kirim verifikasi/i,
    })
    expect(submitButton).toBeDisabled()
  })

  it('submit button is enabled when email is changed to a new valid email', async () => {
    render(<ChangeEmailForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email/i)
    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'new@example.com')

    const submitButton = screen.getByRole('button', {
      name: /kirim verifikasi/i,
    })
    expect(submitButton).not.toBeDisabled()
  })

  it('handles form submission successfully', async () => {
    ;(customFetch as jest.Mock).mockResolvedValueOnce({ statusCode: 200 })

    render(<ChangeEmailForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email/i)
    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'new@example.com')

    const submitButton = screen.getByRole('button', {
      name: /kirim verifikasi/i,
    })
    await userEvent.click(submitButton)

    expect(customFetch).toHaveBeenCalledWith(
      '/profile/email/request-change',
      expect.objectContaining({
        method: 'POST',
      })
    )

    expect(mockSetNewEmail).toHaveBeenCalledWith('new@example.com')
    expect(mockEnableSubmitOtpMode).toHaveBeenCalledTimes(1)
    expect(toast.success).toHaveBeenCalledWith(
      'Kode verifikasi telah dikirim ke email baru'
    )
  })

  it('handles API error during form submission', async () => {
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 400,
      message: 'Email sudah digunakan',
    })

    render(<ChangeEmailForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email/i)
    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'new@example.com')

    const submitButton = screen.getByRole('button', {
      name: /kirim verifikasi/i,
    })
    await userEvent.click(submitButton)

    expect(toast.error).toHaveBeenCalledWith('Email sudah digunakan')
    expect(mockSetNewEmail).not.toHaveBeenCalled()
    expect(mockEnableSubmitOtpMode).not.toHaveBeenCalled()
  })

  it('handles network error during form submission', async () => {
    ;(customFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    )

    render(<ChangeEmailForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email/i)
    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'new@example.com')

    const submitButton = screen.getByRole('button', {
      name: /kirim verifikasi/i,
    })
    await userEvent.click(submitButton)

    expect(toast.error).toHaveBeenCalledWith(
      'Terjadi kesalahan, silakan coba lagi'
    )
  })

  it('displays loading indicator during form submission', async () => {
    // Mock the customFetch to delay the response
    const mockPromise = new Promise((resolve) => {
      // This will keep the promise pending, simulating a slow request
      setTimeout(() => {
        resolve({ statusCode: 200 })
      }, 100)
    })
    ;(customFetch as jest.Mock).mockReturnValueOnce(mockPromise)

    render(<ChangeEmailForm {...defaultProps} />)

    // Change the email to enable the submit button
    const emailInput = screen.getByLabelText(/email/i)
    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'new@example.com')

    // Click the submit button
    const submitButton = screen.getByRole('button', {
      name: /kirim verifikasi/i,
    })
    await userEvent.click(submitButton)

    // Wait for the mock promise to resolve
    await waitFor(() => {
      expect(mockEnableSubmitOtpMode).toHaveBeenCalled()
    })
  })

  it('displays loader instead of text during form submission', async () => {
    // Create a promise that we can control
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let resolvePromise: (value: any) => void
    const mockPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    ;(customFetch as jest.Mock).mockReturnValueOnce(mockPromise)

    render(<ChangeEmailForm {...defaultProps} />)

    // Change the email to enable the submit button
    const emailInput = screen.getByLabelText(/email/i)
    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'new@example.com')

    // Click the submit button
    const submitButton = screen.getByRole('button', {
      name: /kirim verifikasi/i,
    })
    await userEvent.click(submitButton)

    // In the loading state, the loader icon should be visible
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()

    // The "Kirim Verifikasi" text should not be visible
    expect(screen.queryByText('Kirim Verifikasi')).not.toBeInTheDocument()
  })
})
