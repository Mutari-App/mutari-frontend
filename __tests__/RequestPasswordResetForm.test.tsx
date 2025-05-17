import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RequestPasswordResetForm } from '@/modules/ResetPasswordModule/module-elements/requestPasswordResetForm'
import { ResetPasswordContextProvider } from '@/modules/ResetPasswordModule/contexts/ResetPasswordContext'
import { ResetPasswordFormSection } from '@/modules/ResetPasswordModule/sections/ResetPasswordFormSection'
import { customFetch } from '@/utils/customFetch'
import { toast } from 'sonner'

// Define API response types
interface BaseApiResponse {
  statusCode: number
  message: string
  success: boolean
}

interface ApiSuccessResponse extends BaseApiResponse {
  statusCode: 200
  success: true
}

interface ApiErrorResponse extends BaseApiResponse {
  statusCode: 400 | 500
  success: false
}

type ApiResponse = ApiSuccessResponse | ApiErrorResponse

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

interface ReqeuestPasswordResetRequest {
  email: string
}

interface CustomFetchRequest {
  method: string
  body: ReqeuestPasswordResetRequest
}

jest.mock('@/utils/customFetch', () => ({
  customFetch: jest.fn() as jest.Mock<Promise<ApiResponse>>,
  customFetchBody: (
    data: ReqeuestPasswordResetRequest
  ): ReqeuestPasswordResetRequest => data,
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('RequestPasswordReset', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderWithContext = (component: React.ReactNode) => {
    return render(
      <ResetPasswordContextProvider>{component}</ResetPasswordContextProvider>
    )
  }

  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john.doe@example.com' },
    })
  }

  it('should render request password reset form', () => {
    renderWithContext(<RequestPasswordResetForm />)

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Kirim password reset email/i })
    ).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    renderWithContext(<RequestPasswordResetForm />)
    fireEvent.click(
      screen.getByRole('button', { name: /Kirim password reset email/i })
    )

    await waitFor(() => {
      expect(screen.getByText(/Email wajib diisi/i)).toBeInTheDocument()
    })
  })

  it('should submit form successfully and go to next page', async () => {
    const mockResponse: ApiSuccessResponse = {
      statusCode: 200,
      message: 'Success',
      success: true,
    }
    ;(customFetch as jest.Mock<Promise<ApiResponse>>).mockResolvedValueOnce(
      mockResponse
    )

    renderWithContext(<ResetPasswordFormSection />)
    fillForm()
    fireEvent.click(
      screen.getByRole('button', { name: /Kirim password reset email/i })
    )

    await waitFor(() => {
      expect(customFetch).toHaveBeenCalledWith('/auth/requestPasswordReset', {
        method: 'POST',
        body: {
          email: 'john.doe@example.com',
        },
      } as CustomFetchRequest)
      expect(toast.success).toHaveBeenCalledWith(
        'Kode verifikasi dikirim! Silakan cek email Anda.'
      )
      expect(screen.getByText(/Masukkan Kode Verifikasi/i)).toBeInTheDocument()
    })
  })

  it('should handle invalid email error', async () => {
    const mockResponse: ApiErrorResponse = {
      statusCode: 400,
      message: 'Email tidak valid atau tidak terverifikasi!',
      success: false,
    }
    ;(customFetch as jest.Mock<Promise<ApiResponse>>).mockResolvedValueOnce(
      mockResponse
    )

    renderWithContext(<ResetPasswordFormSection />)
    fillForm()
    fireEvent.click(
      screen.getByRole('button', { name: /Kirim password reset email/i })
    )

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Email tidak valid atau tidak terverifikasi!'
      )
    })
  })

  it('should handle API error', async () => {
    ;(customFetch as jest.Mock<Promise<ApiResponse>>).mockRejectedValueOnce(
      new Error('API Error')
    )

    renderWithContext(<ResetPasswordFormSection />)
    fillForm()
    fireEvent.click(
      screen.getByRole('button', { name: /Kirim password reset email/i })
    )

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Terjadi kesalahan. Silakan coba lagi.'
      )
    })
  })

  it('should handle unknown status code', async () => {
    const mockResponse: ApiErrorResponse = {
      statusCode: 500,
      message: 'Internal server error',
      success: false,
    }
    ;(customFetch as jest.Mock<Promise<ApiResponse>>).mockResolvedValueOnce(
      mockResponse
    )

    renderWithContext(<ResetPasswordFormSection />)
    fillForm()
    fireEvent.click(
      screen.getByRole('button', { name: /Kirim password reset email/i })
    )

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Terjadi kesalahan. Silakan coba lagi.'
      )
    })

    expect(
      screen.getByRole('button', { name: /Kirim password reset email/i })
    ).not.toBeDisabled()
  })

  it('should show loading state while submitting', async () => {
    let resolvePromise!: (value: ApiSuccessResponse) => void
    const apiPromise = new Promise<ApiResponse>((resolve) => {
      resolvePromise = resolve
    })

    ;(customFetch as jest.Mock<Promise<ApiResponse>>).mockImplementationOnce(
      () => apiPromise
    )

    renderWithContext(<ResetPasswordFormSection />)
    fillForm()
    fireEvent.click(
      screen.getByRole('button', { name: /Kirim password reset email/i })
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
      expect(screen.getByText(/Masukkan Kode Verifikasi/i)).toBeInTheDocument()
    })
  })
})
