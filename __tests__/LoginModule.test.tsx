import LoginModule from '@/modules/LoginModule'
import { render, screen } from '@testing-library/react'

describe('LoginModule', () => {
  it('renders the login form', () => {
    render(<LoginModule />)

    expect(screen.getAllByText('Masuk').length).toBeGreaterThan(0)
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Masuk/i })).toBeInTheDocument()
  })
})
