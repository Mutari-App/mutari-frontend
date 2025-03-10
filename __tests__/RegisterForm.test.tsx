import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RegisterFormSection } from '@/modules/RegisterModule/sections/RegisterFormSection'
import { RegisterContextProvider } from '@/modules/RegisterModule/contexts/RegisterContext'
import { redirect } from 'next/navigation'

// Mock dependencies
jest.mock('lucide-react', () => ({
  Loader: () => 'Loader',
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const renderWithContext = (component: React.ReactNode) => {
    return render(
      <RegisterContextProvider>{component}</RegisterContextProvider>
    )
  }

  const navigateToRegisterForm = async () => {
    renderWithContext(<RegisterFormSection />)

    // Fill in CreateUserForm
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

    // Submit CreateUserForm
    fireEvent.click(screen.getByRole('button', { name: /Daftar Akun/i }))

    // Wait for navigation to CodeVerificationForm
    await waitFor(() => {
      expect(screen.getByText(/Masukkan Kode Verifikasi/i)).toBeInTheDocument()
    })

    // Fill in CodeVerificationForm
    fireEvent.change(screen.getByPlaceholderText(/Kode Verifikasi/i), {
      target: { value: '12345678' },
    })

    // Submit CodeVerificationForm
    fireEvent.click(screen.getByRole('button', { name: /Verifikasi/i }))

    // Wait for navigation to RegisterForm
    await waitFor(() => {
      expect(screen.getByText(/Buat Password/i)).toBeInTheDocument()
    })
  }

  it('should render register form', async () => {
    await navigateToRegisterForm()

    expect(screen.getByPlaceholderText(/^Password$/i)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/^Konfirmasi Password$/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Simpan Password/i })
    ).toBeInTheDocument()
  })

  it('should validate password requirements', async () => {
    await navigateToRegisterForm()

    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /Simpan Password/i }))

    await waitFor(() => {
      const errorMessages = screen.getAllByText(
        /Password must be at least 8 characters/i
      )
      expect(errorMessages).toHaveLength(2)
      errorMessages.forEach((message) => {
        expect(message).toBeInTheDocument()
      })
    })

    // Test password without uppercase
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^Konfirmasi Password$/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Simpan Password/i }))

    await waitFor(() => {
      const errorMessages = screen.getAllByText(
        /Password must contain at least one uppercase letter/i
      )
      expect(errorMessages).toHaveLength(2)
      errorMessages.forEach((message) => {
        expect(message).toBeInTheDocument()
      })
    })

    // Test password without number
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'PasswordABC' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^Konfirmasi Password$/i), {
      target: { value: 'PasswordABC' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Simpan Password/i }))

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
    await navigateToRegisterForm()

    // Test non-matching passwords
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'Password123' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^Konfirmasi Password$/i), {
      target: { value: 'Password456' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Simpan Password/i }))

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('should submit form and redirect to home', async () => {
    await navigateToRegisterForm()

    // Fill in form with valid data - using more specific selectors
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
      target: { value: 'Password123' },
    })
    fireEvent.change(screen.getByPlaceholderText(/^Konfirmasi Password$/i), {
      target: { value: 'Password123' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Simpan Password/i }))

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith('/')
    })
  })
})
