/* eslint-disable @typescript-eslint/no-unsafe-return */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChangePasswordForm } from '../src/modules/ProfileModule/module-elements/ChangePasswordForm'
import { toast } from 'sonner'
import * as newCustomFetch from '../src/utils/newCustomFetch'

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('../src/utils/newCustomFetch', () => ({
  customFetch: jest.fn(),
  customFetchBody: jest.fn((data) => data),
}))

jest.mock('lucide-react', () => ({
  Loader: () => <div data-testid="loader-icon" />,
}))

describe('ChangePasswordForm', () => {
  const mockCloseDialog = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields and submit button', () => {
    render(<ChangePasswordForm closeDialog={mockCloseDialog} />)

    expect(screen.getByLabelText(/Password Lama/i)).toBeInTheDocument()
    expect(
      screen.getByLabelText(/Konfirmasi Password Baru/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Simpan/i })).toBeInTheDocument()
  })

  it('validates empty fields', async () => {
    render(<ChangePasswordForm closeDialog={mockCloseDialog} />)

    fireEvent.click(screen.getByRole('button', { name: /Simpan/i }))

    await waitFor(() => {
      expect(screen.getByText(/Password lama harus diisi/i)).toBeInTheDocument()
      expect(
        screen.getByText(/Password baru minimal 8 karakter/i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Konfirmasi password harus diisi/i)
      ).toBeInTheDocument()
    })
  })

  it('validates password requirements', async () => {
    render(<ChangePasswordForm closeDialog={mockCloseDialog} />)

    await userEvent.type(screen.getByLabelText(/Password Lama/i), 'oldpassword')
    await userEvent.type(
      screen.getByLabelText(/Konfirmasi Password Baru/i),
      'short'
    )

    fireEvent.click(screen.getByRole('button', { name: /Simpan/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/Password baru minimal 8 karakter/i)
      ).toBeInTheDocument()
    })

    // Test uppercase requirement
    await userEvent.clear(screen.getByLabelText(/^Password Baru$/i))
    await userEvent.type(
      screen.getByLabelText(/^Password Baru$/i),
      'password123'
    )

    fireEvent.click(screen.getByRole('button', { name: /Simpan/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/Password harus memiliki minimal satu huruf besar/i)
      ).toBeInTheDocument()
    })

    // Test number requirement
    await userEvent.clear(screen.getByLabelText(/^Password Baru$/i))
    await userEvent.type(screen.getByLabelText(/^Password Baru$/i), 'Password')

    fireEvent.click(screen.getByRole('button', { name: /Simpan/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/Password harus memiliki minimal satu angka/i)
      ).toBeInTheDocument()
    })
  })

  it('successfully submits the form and closes dialog', async () => {
    ;(newCustomFetch.customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      message: 'Success',
    })

    render(<ChangePasswordForm closeDialog={mockCloseDialog} />)

    await userEvent.type(screen.getByLabelText(/Password Lama/i), 'oldpassword')
    await userEvent.type(
      screen.getByLabelText(/^Password Baru$/i),
      'Password123'
    )
    await userEvent.type(
      screen.getByLabelText(/Konfirmasi Password Baru/i),
      'Password123'
    )

    fireEvent.click(screen.getByRole('button', { name: /Simpan/i }))

    await waitFor(() => {
      expect(newCustomFetch.customFetch).toHaveBeenCalledWith(
        '/profile/password',
        expect.objectContaining({
          method: 'PATCH',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          body: expect.any(Object),
        })
      )
      expect(toast.success).toHaveBeenCalledWith('Password berhasil diubah!')
      expect(mockCloseDialog).toHaveBeenCalled()
    })
  })

  it('shows loader during form submission', async () => {
    const fetchPromise = new Promise((resolve) =>
      setTimeout(() => resolve({ statusCode: 200 }), 1000)
    )
    ;(newCustomFetch.customFetch as jest.Mock).mockReturnValueOnce(fetchPromise)

    render(<ChangePasswordForm closeDialog={mockCloseDialog} />)

    await userEvent.type(screen.getByLabelText(/Password Lama/i), 'oldpassword')
    await userEvent.type(
      screen.getByLabelText(/^Password Baru$/i),
      'Password123'
    )

    await userEvent.type(
      screen.getByLabelText(/Konfirmasi Password Baru/i),
      'Password123'
    )

    fireEvent.click(screen.getByRole('button', { name: /Simpan/i }))

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled()
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
    })
  })

  it('does not make API call when form has validation errors', async () => {
    render(<ChangePasswordForm closeDialog={mockCloseDialog} />)

    await userEvent.type(screen.getByLabelText(/Password Lama/i), 'old')
    await userEvent.type(screen.getByLabelText(/^Password Baru$/i), 'short')
    await userEvent.type(
      screen.getByLabelText(/Konfirmasi Password Baru/i),
      'diff'
    )

    fireEvent.click(screen.getByRole('button', { name: /Simpan/i }))

    await waitFor(() => {
      expect(newCustomFetch.customFetch).not.toHaveBeenCalled()
    })
  })
})
