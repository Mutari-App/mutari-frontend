import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useResetPasswordContext } from '@/modules/ResetPasswordModule/contexts/ResetPasswordContext'
import { CodeVerificationForm } from '@/modules/ResetPasswordModule/module-elements/codeVerificationForm'
import { customFetch } from '@/utils/customFetch'
import { toast } from 'sonner'

jest.mock('lucide-react', () => ({
  Loader: () => 'Loader',
}))

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
}))

jest.mock('@/utils/customFetch', () => ({
  customFetch: jest.fn(),
  customFetchBody: (data: object) => JSON.stringify(data),
}))

jest.mock(
  '@/modules/ResetPasswordModule/contexts/ResetPasswordContext',
  () => ({
    useResetPasswordContext: jest.fn(),
  })
)

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('PasswordResetCodeVerificationForm', () => {
  const mockResetPasswordData = {
    email: 'john.doe@example.com',
    uniqueCode: '',
  }

  const mockSetPasswordResetData = jest.fn()
  const mockGoToNextPage = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useResetPasswordContext as jest.Mock).mockReturnValue({
      resetPasswordData: mockResetPasswordData,
      setResetPasswordData: mockSetPasswordResetData,
      goToNextPage: mockGoToNextPage,
    })
    render(<CodeVerificationForm />)
  })

  it('should render code verification form', () => {
    expect(screen.getByPlaceholderText(/Kode Verifikasi/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Verifikasi/i })
    ).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    fireEvent.click(screen.getByRole('button', { name: /Verifikasi/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/Unique Code must be 8 characters./i)
      ).toBeInTheDocument()
    })
  })

  it('should submit form and go to next page', async () => {
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      message: 'Success',
      success: true,
    })

    fireEvent.change(screen.getByPlaceholderText(/Kode Verifikasi/i), {
      target: { value: '12345678' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Verifikasi/i }))

    await waitFor(() => {
      expect(customFetch).toHaveBeenCalledWith('/auth/verifyPasswordReset', {
        method: 'POST',
        body: JSON.stringify({
          email: 'john.doe@example.com',
          verificationCode: '12345678',
        }),
      })
      expect(toast.success).toHaveBeenCalledWith('Verifikasi kode berhasil!')
      expect(mockGoToNextPage).toHaveBeenCalled()
    })
  })

  it('should not go to next page on invalid submission', async () => {
    fireEvent.change(screen.getByPlaceholderText(/Kode Verifikasi/i), {
      target: { value: '123' }, // Invalid code (less than 8 characters)
    })
    fireEvent.click(screen.getByRole('button', { name: /Verifikasi/i }))

    await waitFor(() => {
      expect(screen.queryByText(/Buat Password/i)).not.toBeInTheDocument()
      expect(
        screen.getByText(/Unique Code must be 8 characters./i)
      ).toBeInTheDocument()
    })
  })

  it('should show toast when handling API error', async () => {
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 500,
      message: 'Internal Server Error',
      success: true,
    })

    fireEvent.change(screen.getByPlaceholderText(/Kode Verifikasi/i), {
      target: { value: '12345678' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Verifikasi/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Terjadi kesalahan. Silakan coba lagi.'
      )
    })

    expect(
      screen.getByRole('button', { name: /Verifikasi/i })
    ).not.toBeDisabled()
  })

  it('should show toast when handling thrown error', async () => {
    ;(customFetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

    fireEvent.change(screen.getByPlaceholderText(/Kode Verifikasi/i), {
      target: { value: '12345678' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Verifikasi/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Terjadi kesalahan. Silakan coba lagi.'
      )
    })

    expect(
      screen.getByRole('button', { name: /Verifikasi/i })
    ).not.toBeDisabled()
  })

  it('should show loading state while submitting', async () => {
    let resolvePromise!: (value: unknown) => void
    const apiPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    ;(customFetch as jest.Mock).mockImplementationOnce(() => apiPromise)

    fireEvent.change(screen.getByPlaceholderText(/Kode Verifikasi/i), {
      target: { value: '12345678' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Verifikasi/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Loader/i })).toBeDisabled()
      expect(screen.getByText('Loader')).toBeInTheDocument()
    })

    resolvePromise({
      statusCode: 200,
      message: 'Success',
      success: true,
    })

    await waitFor(() => {
      expect(mockSetPasswordResetData).toHaveBeenCalled()

      const mockCall = mockSetPasswordResetData.mock.calls[0] as unknown[]
      const updateFn = mockCall[0] as jest.Mock

      const result = updateFn({
        ...mockResetPasswordData,
        uniqueCode: '',
      }) as unknown

      expect(result).toEqual({
        ...mockResetPasswordData,
        uniqueCode: '12345678',
      })

      expect(mockGoToNextPage).toHaveBeenCalled()
    })
  })
})
