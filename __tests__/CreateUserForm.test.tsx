import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CreateUserForm } from '@/modules/RegisterModule/module-elements/createUserForm'
import { RegisterContextProvider } from '@/modules/RegisterModule/contexts/RegisterContext'
import { RegisterFormSection } from '@/modules/RegisterModule/sections/RegisterFormSection'

// Mock dependencies
jest.mock('lucide-react', () => ({
  Loader: () => 'Loader',
}))

describe('CreateUserForm', () => {
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

  it('should submit form and go to next page', async () => {
    renderWithContext(<RegisterFormSection />)

    // Fill in form
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

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Daftar Akun/i }))

    await waitFor(() => {
      // Verify that the next page (CodeVerificationForm) is displayed
      expect(screen.getByText(/Masukkan Kode Verifikasi/i)).toBeInTheDocument()
    })
  })

  it('should submit form and go to next page', async () => {
    renderWithContext(<RegisterFormSection />)

    fireEvent.change(screen.getByLabelText(/Nama Depan/i), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByLabelText(/Nama Belakang/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john.doe@example.com' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Daftar Akun/i }))

    await waitFor(() => {
      expect(screen.getByText(/Masukkan Kode Verifikasi/i)).toBeInTheDocument()
    })
  })
})
