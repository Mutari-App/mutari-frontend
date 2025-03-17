import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateUserForm } from '@/modules/RegisterModule/module-elements/createUserForm'
import { RegisterContextProvider } from '@/modules/RegisterModule/contexts/RegisterContext'
import { RegisterFormSection } from '@/modules/RegisterModule/sections/RegisterFormSection'
import { customFetch } from '@/utils/customFetch'
import { toast } from 'sonner'

// Define API response types
interface BaseApiResponse {
  statusCode: number
  message: string
  success: boolean
}

interface ApiSuccessResponse extends BaseApiResponse {
  statusCode: 201
  success: true
}

interface ApiErrorResponse extends BaseApiResponse {
  statusCode: 409 | 500
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

interface CreateUserRequest {
  firstName: string
  lastName: string
  email: string
  birthDate?: string
}

interface CustomFetchRequest {
  method: string
  body: CreateUserRequest
}

jest.mock('@/utils/customFetch', () => ({
  customFetch: jest.fn() as jest.Mock<Promise<ApiResponse>>,
  customFetchBody: (data: CreateUserRequest): CreateUserRequest => data,
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('CreateUserForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderWithContext = (component: React.ReactNode) => {
    return render(
      <RegisterContextProvider>{component}</RegisterContextProvider>
    )
  }

  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/Nama Depan/i), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByLabelText(/Nama Belakang/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john.doe@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Hari/i), {
      target: { value: '1' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Bulan/i), {
      target: { value: '1' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Tahun/i), {
      target: { value: '2000' },
    })
  }

  it('should render create user form', () => {
    renderWithContext(<CreateUserForm />)

    expect(screen.getByLabelText(/Nama Depan/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Nama Belakang/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Hari/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Bulan/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Tahun/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Daftar Akun/i })
    ).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    renderWithContext(<CreateUserForm />)
    fireEvent.click(screen.getByRole('button', { name: /Daftar Akun/i }))

    await waitFor(() => {
      expect(screen.getByText(/Nama depan wajib diisi/i)).toBeInTheDocument()
      expect(screen.getByText(/Email wajib diisi/i)).toBeInTheDocument()
    })
  })

  it('should submit form successfully and go to next page', async () => {
    const mockResponse: ApiSuccessResponse = {
      statusCode: 201,
      message: 'Success',
      success: true,
    }
    ;(customFetch as jest.Mock<Promise<ApiResponse>>).mockResolvedValueOnce(
      mockResponse
    )

    renderWithContext(<RegisterFormSection />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /Daftar Akun/i }))

    await waitFor(() => {
      expect(customFetch).toHaveBeenCalledWith('/auth/createUser', {
        method: 'POST',
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          birthDate: new Date('01-01-2000').toISOString(),
        },
      } as CustomFetchRequest)
      expect(toast.success).toHaveBeenCalledWith(
        'Kode verifikasi dikirim! Silakan cek email Anda.'
      )
      expect(screen.getByText(/Masukkan Kode Verifikasi/i)).toBeInTheDocument()
    })
  })

  it('should handle existing email error', async () => {
    const mockResponse: ApiErrorResponse = {
      statusCode: 409,
      message: 'Email already exists',
      success: false,
    }
    ;(customFetch as jest.Mock<Promise<ApiResponse>>).mockResolvedValueOnce(
      mockResponse
    )

    renderWithContext(<RegisterFormSection />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /Daftar Akun/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Email ini sudah terdaftar!')
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('should handle API error', async () => {
    ;(customFetch as jest.Mock<Promise<ApiResponse>>).mockRejectedValueOnce(
      new Error('API Error')
    )

    renderWithContext(<RegisterFormSection />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /Daftar Akun/i }))

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

    renderWithContext(<RegisterFormSection />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /Daftar Akun/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Terjadi kesalahan. Silakan coba lagi.'
      )
    })

    expect(
      screen.getByRole('button', { name: /Daftar Akun/i })
    ).not.toBeDisabled()
  })

  it('should submit form without birthdate', async () => {
    const mockResponse: ApiSuccessResponse = {
      statusCode: 201,
      message: 'Success',
      success: true,
    }
    ;(customFetch as jest.Mock<Promise<ApiResponse>>).mockResolvedValueOnce(
      mockResponse
    )

    renderWithContext(<RegisterFormSection />)

    fireEvent.change(screen.getByLabelText(/Nama Depan/i), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john.doe@example.com' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Daftar Akun/i }))

    await waitFor(() => {
      expect(customFetch).toHaveBeenCalledWith('/auth/createUser', {
        method: 'POST',
        body: {
          firstName: 'John',
          lastName: '',
          email: 'john.doe@example.com',
          birthDate: undefined,
        },
      })
      expect(toast.success).toHaveBeenCalledWith(
        'Kode verifikasi dikirim! Silakan cek email Anda.'
      )
      expect(screen.getByText(/Masukkan Kode Verifikasi/i)).toBeInTheDocument()
    })
  })

  it('should show loading state while submitting', async () => {
    let resolvePromise!: (value: ApiSuccessResponse) => void
    const apiPromise = new Promise<ApiResponse>((resolve) => {
      resolvePromise = resolve
    })

    ;(customFetch as jest.Mock<Promise<ApiResponse>>).mockImplementationOnce(
      () => apiPromise
    )

    renderWithContext(<RegisterFormSection />)
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /Daftar Akun/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Loader/i })).toBeDisabled()
      expect(screen.getByText('Loader')).toBeInTheDocument()
    })

    resolvePromise({
      statusCode: 201,
      message: 'Success',
      success: true,
    })

    await waitFor(() => {
      expect(screen.getByText(/Masukkan Kode Verifikasi/i)).toBeInTheDocument()
    })
  })
})
