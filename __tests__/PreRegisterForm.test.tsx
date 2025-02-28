import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PreRegisterForm } from '@/modules/LandingPageModule/module-elements/PreRegisterForm'
import { customFetch } from '@/utils/customFetch'
import { toast } from 'sonner'

// Mock dependencies
jest.mock('@/utils/customFetch')
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
jest.mock('lucide-react', () => ({
  CheckCircle: () => 'CheckCircle',
  Loader: () => 'Loader',
}))

describe('PreRegisterForm', () => {
  const mockProps = {
    isSuccess: false,
    setIsSuccess: jest.fn(),
    showLoginForm: jest.fn(),
    email: '',
    setEmail: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders pre-register form when isSuccess is false', () => {
    render(<PreRegisterForm {...mockProps} />)

    expect(screen.getByLabelText(/Nama Depan/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Nama Akhir/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/No\. HP/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Kode Referal/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Praregistrasi/i })
    ).toBeInTheDocument()
  })

  test('renders success message when isSuccess is true', () => {
    const successProps = {
      ...mockProps,
      isSuccess: true,
      email: 'test@example.com',
    }

    render(<PreRegisterForm {...successProps} />)

    expect(screen.getByText(/Praregistrasi Berhasil!/i)).toBeInTheDocument()
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()
  })

  test('calls showLoginForm when login button is clicked in success view', () => {
    const successProps = {
      ...mockProps,
      isSuccess: true,
      email: 'test@example.com',
    }

    render(<PreRegisterForm {...successProps} />)

    fireEvent.click(screen.getByRole('button', { name: /Login/i }))
    expect(mockProps.showLoginForm).toHaveBeenCalledTimes(1)
  })

  test('calls showLoginForm when "Login di sini" is clicked', () => {
    render(<PreRegisterForm {...mockProps} />)

    fireEvent.click(screen.getByText(/Login di sini/i))
    expect(mockProps.showLoginForm).toHaveBeenCalledTimes(1)
  })

  test('validates required fields', async () => {
    render(<PreRegisterForm {...mockProps} />)

    fireEvent.click(screen.getByRole('button', { name: /Praregistrasi/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/Nama depan minimal 2 karakter/i)
      ).toBeInTheDocument()
      expect(screen.getByText(/Masukkan email yang valid/i)).toBeInTheDocument()
      expect(screen.getByText(/Nomor telepon tidak valid/i)).toBeInTheDocument()
    })
  })

  test('normalizes phone number and submits form successfully', async () => {
    // Mock successful API response
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      message: 'Success',
    })

    render(<PreRegisterForm {...mockProps} />)

    // Fill in form
    fireEvent.change(screen.getByLabelText(/Nama Depan/i), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByLabelText(/Nama Akhir/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john.doe@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/No\. HP/i), {
      target: { value: '081234567890' },
    })
    fireEvent.change(screen.getByLabelText(/Kode Referal/i), {
      target: { value: 'REF123' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Praregistrasi/i }))

    await waitFor(() => {
      // Check if API was called with correct parameters
      expect(customFetch).toHaveBeenCalledWith('/pre-register', {
        method: 'POST',
      })

      // Verify state changes
      expect(mockProps.setEmail).toHaveBeenCalledWith('john.doe@example.com')
      expect(mockProps.setIsSuccess).toHaveBeenCalledWith(true)
      expect(toast.success).toHaveBeenCalledWith('Praregistrasi berhasil!', {
        description: 'Silahkan cek email anda!',
      })
    })
  })

  test('handles API error', async () => {
    // Mock API error response
    const errorMessage = 'Email already registered'
    ;(customFetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    render(<PreRegisterForm {...mockProps} />)

    // Fill in form
    fireEvent.change(screen.getByLabelText(/Nama Depan/i), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john.doe@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/No\. HP/i), {
      target: { value: '081234567890' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Praregistrasi/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
      expect(mockProps.setIsSuccess).not.toHaveBeenCalled()
    })
  })

  test('handles empty referral code correctly', async () => {
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      message: 'Success',
    })

    render(<PreRegisterForm {...mockProps} />)

    // Fill in required fields with empty referral
    fireEvent.change(screen.getByLabelText(/Nama Depan/i), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john.doe@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/No\. HP/i), {
      target: { value: '081234567890' },
    })
    fireEvent.change(screen.getByLabelText(/Kode Referal/i), {
      target: { value: '' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Praregistrasi/i }))

    await waitFor(() => {
      expect(customFetch).toHaveBeenCalledWith('/pre-register', {
        method: 'POST',
      })
    })
  })
})
