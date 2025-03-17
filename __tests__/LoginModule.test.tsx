import LoginModule from '@/modules/LoginModule'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'

jest.mock('lucide-react', () => ({
  Mail: () => <div data-testid="mail-icon" />,
}))

const mockPush = jest.fn()
const mockSearchParams = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
  useSearchParams: () => ({
    get: mockSearchParams,
  }),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

const mockLogin = jest.fn()
jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: () => ({
    login: mockLogin,
    isAuthenticated: false,
  }),
}))

jest.mock('@/utils/getImage', () => ({
  getImage: jest
    .fn()
    .mockReturnValue(
      'https://res.cloudinary.com/mutari/image/upload/auth_bg.png'
    ),
}))

describe('LoginModule', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock successful login response
    mockLogin.mockResolvedValue({ statusCode: 200 })
  })

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
    render(<LoginModule />)

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Masuk/i })

    // Fill form with valid data
    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'dummyPassword')

    // Submit form
    fireEvent.click(submitButton)

    // Check if login was called with correct values
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'dummyPassword',
      })
      expect(toast.success).toHaveBeenCalledWith('Berhasil login!')
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('shows error toast on login failure', async () => {
    // Mock login failure
    mockLogin.mockRejectedValueOnce(new Error('Login failed'))

    render(<LoginModule />)

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Masuk/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'wrongPassword')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Login failed')
    })
  })

  it('should use default redirect path when no redirect param', async () => {
    // Mock no redirect param
    mockSearchParams.mockReturnValue(null)

    render(<LoginModule />)

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Masuk/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'validPassword')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('should use custom redirect path when provided', async () => {
    // Mock redirect param
    mockSearchParams.mockReturnValue('/dashboard')

    render(<LoginModule />)

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Masuk/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'validPassword')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('should update redirect path when searchParams changes', async () => {
    const { rerender } = render(<LoginModule />)

    // Initially no redirect
    mockSearchParams.mockReturnValue(null)

    // Change searchParams to include redirect
    mockSearchParams.mockReturnValue('/profile')

    // Trigger re-render to simulate searchParams change
    rerender(<LoginModule />)

    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/Password/i)
    const submitButton = screen.getByRole('button', { name: /Masuk/i })

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(passwordInput, 'validPassword')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile')
    })
  })
})
