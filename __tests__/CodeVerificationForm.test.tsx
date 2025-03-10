import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RegisterFormSection } from '@/modules/RegisterModule/sections/RegisterFormSection'
import { RegisterContextProvider } from '@/modules/RegisterModule/contexts/RegisterContext'

// Mock dependencies
jest.mock('lucide-react', () => ({
  Loader: () => 'Loader',
}))

describe('CodeVerificationForm', () => {
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

  // Helper function to navigate to CodeVerificationForm
  const navigateToCodeVerificationForm = async () => {
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
  }

  it('should render code verification form', async () => {
    await navigateToCodeVerificationForm()
    expect(screen.getByPlaceholderText(/Kode Verifikasi/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Verifikasi/i })
    ).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    await navigateToCodeVerificationForm()
    fireEvent.click(screen.getByRole('button', { name: /Verifikasi/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/Unique Code must be 8 characters./i)
      ).toBeInTheDocument()
    })
  })

  it('should submit form and go to next page', async () => {
    await navigateToCodeVerificationForm()

    // Fill in form
    fireEvent.change(screen.getByPlaceholderText(/Kode Verifikasi/i), {
      target: { value: '12345678' },
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Verifikasi/i }))

    await waitFor(() => {
      // Verify that the next page is displayed
      expect(screen.getByText(/Buat Password/i)).toBeInTheDocument()
    })
  })

  it('should not go to next page on invalid submission', async () => {
    await navigateToCodeVerificationForm()

    // Fill in form with invalid data
    fireEvent.change(screen.getByPlaceholderText(/Kode Verifikasi/i), {
      target: { value: '123' }, // Invalid code (less than 8 characters)
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Verifikasi/i }))

    await waitFor(() => {
      // Verify that the form does not go to the next page
      expect(screen.queryByText(/Buat Password/i)).not.toBeInTheDocument()
      expect(
        screen.getByText(/Unique Code must be 8 characters./i)
      ).toBeInTheDocument()
    })
  })
})
