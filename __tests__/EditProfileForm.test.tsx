/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditProfileForm } from '@/modules/ProfileModule/module-elements/EditProfileForm'
import { useAuthContext } from '@/contexts/AuthContext'
import { customFetch } from '@/utils/newCustomFetch'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

// Mock dependencies
jest.mock('@/contexts/AuthContext')
jest.mock('@/utils/newCustomFetch')
jest.mock('sonner')
jest.mock('next/navigation')
jest.mock('lucide-react', () => ({
  Loader: () => <div data-testid="loader-icon" />,
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
}))

describe('EditProfileForm', () => {
  const mockCloseDialog = jest.fn()
  const mockChangeEmailButtonHandler = jest.fn()
  const mockGetMe = jest.fn()
  const mockRefresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock useAuthContext
    ;(useAuthContext as jest.Mock).mockReturnValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
      },
      getMe: mockGetMe,
    })

    // Mock useRouter
    ;(useRouter as jest.Mock).mockReturnValue({
      refresh: mockRefresh,
    })

    // Mock customFetch
    ;(customFetch as jest.Mock).mockResolvedValue({
      statusCode: 200,
      message: 'Success',
    })

    // Mock toast
    ;(toast.success as jest.Mock).mockReturnValue(undefined)
    ;(toast.error as jest.Mock).mockReturnValue(undefined)
  })

  test('renders the form correctly', () => {
    render(
      <EditProfileForm
        closeDialog={mockCloseDialog}
        changeEmailButtonHandler={mockChangeEmailButtonHandler}
      />
    )

    expect(screen.getByText('Nama Depan')).toBeInTheDocument()
    expect(screen.getByText('Nama Belakang')).toBeInTheDocument()
    expect(screen.getByText('Tanggal Lahir')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Hari')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Bulan')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tahun')).toBeInTheDocument()
    expect(screen.getByText('Ubah Email')).toBeInTheDocument()
    expect(screen.getByText('Simpan')).toBeInTheDocument()
    expect(screen.getByText('Link Akun Google')).toBeInTheDocument()
  })

  test('initializes form with user data', () => {
    render(
      <EditProfileForm
        closeDialog={mockCloseDialog}
        changeEmailButtonHandler={mockChangeEmailButtonHandler}
      />
    )

    const firstNameInput = screen.getByPlaceholderText(
      'Nama Depan'
    ) as HTMLInputElement
    const lastNameInput = screen.getByPlaceholderText(
      'Nama Belakang'
    ) as HTMLInputElement
    const dayInput = screen.getByPlaceholderText('Hari') as HTMLInputElement
    const monthInput = screen.getByPlaceholderText('Bulan') as HTMLInputElement
    const yearInput = screen.getByPlaceholderText('Tahun') as HTMLInputElement

    expect(firstNameInput.value).toBe('John')
    expect(lastNameInput.value).toBe('Doe')
    expect(dayInput.value).toBe('1')
    expect(monthInput.value).toBe('1')
    expect(yearInput.value).toBe('1990')
  })

  test('clicking "Ubah Email" button calls handler', async () => {
    const user = userEvent.setup()
    render(
      <EditProfileForm
        closeDialog={mockCloseDialog}
        changeEmailButtonHandler={mockChangeEmailButtonHandler}
      />
    )

    const changeEmailButton = screen.getByText('Ubah Email').closest('button')
    await user.click(changeEmailButton!)

    expect(mockChangeEmailButtonHandler).toHaveBeenCalledTimes(1)
  })

  test('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(
      <EditProfileForm
        closeDialog={mockCloseDialog}
        changeEmailButtonHandler={mockChangeEmailButtonHandler}
      />
    )

    const firstNameInput = screen.getByPlaceholderText('Nama Depan')
    const lastNameInput = screen.getByPlaceholderText('Nama Belakang')

    await user.clear(firstNameInput)
    await user.type(firstNameInput, 'Jane')
    await user.clear(lastNameInput)
    await user.type(lastNameInput, 'Smith')

    const submitButton = screen.getByRole('button', { name: /Simpan/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Profil berhasil diubah!')
      expect(mockGetMe).toHaveBeenCalledTimes(1)
      expect(mockRefresh).toHaveBeenCalledTimes(1)
      expect(mockCloseDialog).toHaveBeenCalledTimes(1)
    })
  })

  test('shows error message on API failure', async () => {
    ;(customFetch as jest.Mock).mockRejectedValue(new Error('API Error'))

    const user = userEvent.setup()
    render(
      <EditProfileForm
        closeDialog={mockCloseDialog}
        changeEmailButtonHandler={mockChangeEmailButtonHandler}
      />
    )

    const submitButton = screen.getByRole('button', { name: /Simpan/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('API Error')

      expect(mockCloseDialog).not.toHaveBeenCalled()
    })
  })

  test('validates required fields', async () => {
    const user = userEvent.setup()
    render(
      <EditProfileForm
        closeDialog={mockCloseDialog}
        changeEmailButtonHandler={mockChangeEmailButtonHandler}
      />
    )

    const firstNameInput = screen.getByPlaceholderText('Nama Depan')
    await user.clear(firstNameInput)

    const submitButton = screen.getByRole('button', { name: /Simpan/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Nama depan wajib diisi.')).toBeInTheDocument()
    })

    expect(customFetch).not.toHaveBeenCalled()
  })

  test('handles case when user has no birth date', () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({
      user: {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: null,
      },
      getMe: mockGetMe,
    })

    render(
      <EditProfileForm
        closeDialog={mockCloseDialog}
        changeEmailButtonHandler={mockChangeEmailButtonHandler}
      />
    )

    const dayInput = screen.getByPlaceholderText('Hari') as HTMLInputElement
    const monthInput = screen.getByPlaceholderText('Bulan') as HTMLInputElement
    const yearInput = screen.getByPlaceholderText('Tahun') as HTMLInputElement

    expect(dayInput.value).toBe('')
    expect(monthInput.value).toBe('')
    expect(yearInput.value).toBe('')
  })

  test('disables submit button while submitting', async () => {
    const user = userEvent.setup()
    ;(customFetch as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ statusCode: 200 }), 100)
        )
    )

    render(
      <EditProfileForm
        closeDialog={mockCloseDialog}
        changeEmailButtonHandler={mockChangeEmailButtonHandler}
      />
    )

    const submitButton = screen.getByRole('button', { name: /Simpan/i })
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()

    await waitFor(() => {
      expect(customFetch).toHaveBeenCalled()
    })
  })
})
