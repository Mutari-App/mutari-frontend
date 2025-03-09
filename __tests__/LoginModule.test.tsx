import LoginModule from '@/modules/LoginModule'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('LoginModule', () => {
  it('renders the login form', () => {
    render(<LoginModule />)

    expect(screen.getAllByText('Masuk').length).toBeGreaterThan(0)
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Masuk/i })).toBeInTheDocument()
  })

  it('validates email format', async () => {
    render(<LoginModule />)

    const emailInput = screen.getByLabelText(/Email/i)
    const form = screen.getByRole('form')

    // Type invalid email
    await userEvent.type(emailInput, 'invalid-email')

    // Submit the form directly to bypass browser validation
    fireEvent.submit(form)

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Email tidak valid')).toBeInTheDocument()
    })

    // Clear and type valid email
    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'valid@example.com')

    // Submit again
    fireEvent.submit(form)

    // Error should be gone
    await waitFor(() => {
      expect(screen.queryByText('Email tidak valid')).not.toBeInTheDocument()
    })
  })

  it('validates password length', async () => {
    render(<LoginModule />)

    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Masuk/i })

    // Type short password
    await userEvent.type(passwordInput, 'short')
    fireEvent.click(submitButton)

    // Check for error message
    await waitFor(() => {
      expect(
        screen.getByText('Password minimal 6 karakter')
      ).toBeInTheDocument()
    })

    // Clear and type valid password
    await userEvent.clear(passwordInput)
    await userEvent.type(passwordInput, 'validpassword')
    fireEvent.click(submitButton)

    // Error should be gone
    await waitFor(() => {
      expect(
        screen.queryByText('Password minimal 6 karakter')
      ).not.toBeInTheDocument()
    })
  })

  it('submits the form with valid data', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    render(<LoginModule />)

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Masuk/i })

    // Fill form with valid data
    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'dummyPassword')

    // Submit form
    fireEvent.click(submitButton)

    // Check if onSubmit was called with correct values
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Login values:', {
        email: 'test@example.com',
        password: 'dummyPassword',
      })
    })

    consoleSpy.mockRestore()
  })
})
