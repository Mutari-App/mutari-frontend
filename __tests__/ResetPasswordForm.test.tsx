import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useResetPasswordContext } from '@/modules/ResetPasswordModule/contexts/ResetPasswordContext'
import { ResetPasswordForm } from '@/modules/ResetPasswordModule/module-elements/resetPasswordForm'
import { toast } from 'sonner'
import { customFetch } from '@/utils/customFetch'

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

describe('ResetPasswordForm', () => {
  const mockResetPasswordData = {
    email: 'john.doe@example.com',
    uniqueCode: '12345678',
    password: '',
    confirmPassword: '',
  }

  const mockSetResetPasswordData = jest.fn()
  const mockGoToNextPage = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useResetPasswordContext as jest.Mock).mockReturnValue({
      resetPasswordData: mockResetPasswordData,
      setResetPasswordData: mockSetResetPasswordData,
      goToNextPage: mockGoToNextPage,
    })
    render(<ResetPasswordForm />)
  })

  it('should render reset password form', async () => {
    expect(screen.getByPlaceholderText(/^Password$/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/^Konfirmasi Password$/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Simpan password baru/i })
    ).toBeInTheDocument()
  })

  it('should validate password requirements', async () => {
    fireEvent.click(
      screen.getByRole('button', { name: /Simpan password baru/i })
    )

    await waitFor(() => {
      const errorMessages = screen.getAllByText(
        /Password must be at least 8 characters/i
      )
      expect(errorMessages).toHaveLength(2)
      errorMessages.forEach((message) => {
        expect(message).toBeInTheDocument()
      })
    })

    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^Konfirmasi Password$/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(
      screen.getByRole('button', { name: /Simpan password baru/i })
    )

    await waitFor(() => {
      const errorMessages = screen.getAllByText(
        /Password must contain at least one uppercase letter/i
      )
      expect(errorMessages).toHaveLength(2)
      errorMessages.forEach((message) => {
        expect(message).toBeInTheDocument()
      })
    })

    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'PasswordABC' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^Konfirmasi Password$/i), {
      target: { value: 'PasswordABC' },
    })

    fireEvent.click(
      screen.getByRole('button', { name: /Simpan password baru/i })
    )

    await waitFor(() => {
      const errorMessages = screen.getAllByText(
        /Password must contain at least one number/i
      )
      expect(errorMessages).toHaveLength(2)
      errorMessages.forEach((message) => {
        expect(message).toBeInTheDocument()
      })
    })
  })

  it('should validate password match', async () => {
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'Password123' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^Konfirmasi Password$/i), {
      target: { value: 'Password456' },
    })

    fireEvent.click(
      screen.getByRole('button', { name: /Simpan password baru/i })
    )

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('should submit form and redirect to login', async () => {
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      message: 'Success',
      success: true,
    })

    // Fill in form with valid data - using more specific selectors
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'Test12345' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^Konfirmasi Password$/i), {
      target: { value: 'Test12345' },
    })

    // Submit form
    fireEvent.click(
      screen.getByRole('button', { name: /Simpan password baru/i })
    )

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Password baru berhasil disimpan!'
      )
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('should show toast when handling API error', async () => {
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 500,
      message: 'Internal Server Error',
      success: true,
    })

    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'Test12345' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^Konfirmasi Password$/i), {
      target: { value: 'Test12345' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: /Simpan password baru/i })
    )

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Terjadi kesalahan. Silakan coba lagi.'
      )
    })

    expect(
      screen.getByRole('button', { name: /Simpan password baru/i })
    ).not.toBeDisabled()
  })

  it('should show toast when handling thrown error', async () => {
    ;(customFetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'Test12345' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^Konfirmasi Password$/i), {
      target: { value: 'Test12345' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: /Simpan password baru/i })
    )

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Terjadi kesalahan. Silakan coba lagi.'
      )
    })

    expect(
      screen.getByRole('button', { name: /Simpan password baru/i })
    ).not.toBeDisabled()
  })

  it('should show loading state while submitting', async () => {
    let resolvePromise!: (value: unknown) => void
    const apiPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    ;(customFetch as jest.Mock).mockImplementationOnce(() => apiPromise)

    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'Test12345' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^Konfirmasi Password$/i), {
      target: { value: 'Test12345' },
    })
    fireEvent.click(
      screen.getByRole('button', { name: /Simpan password baru/i })
    )

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
      expect(mockSetResetPasswordData).toHaveBeenCalled()

      const mockCall = mockSetResetPasswordData.mock.calls[0] as unknown[]
      const updateFn = mockCall[0] as jest.Mock

      const result = updateFn({
        ...mockResetPasswordData,
        password: '',
        confirmPassword: '',
      }) as unknown

      expect(result).toEqual({
        ...mockResetPasswordData,
        password: 'Test12345',
        confirmPassword: 'Test12345',
      })

      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })
})
