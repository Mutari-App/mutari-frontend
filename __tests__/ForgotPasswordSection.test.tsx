import React from 'react'
import { render, screen } from '@testing-library/react'
import { ForgotPasswordSection } from '@/modules/ResetPasswordModule/sections/ForgotPasswordSection'

jest.mock('lucide-react', () => ({
  Mail: () => <span data-testid="mail-icon">Mail Icon Mock</span>,
}))

describe('ForgotPasswordSection', () => {
  it('should render static content correctly', () => {
    render(<ForgotPasswordSection />)

    // Check headings and text content
    expect(screen.getByText('Kehilangan Password?')).toBeInTheDocument()
    expect(
      screen.getByText(
        /Jangan khawatir! Anda dapat menyetel ulang kata sandi akun Mutari Anda dengan mengikuti form di samping ini./i
      )
    ).toBeInTheDocument()
    expect(screen.getByText('Ikuti Kami')).toBeInTheDocument()
    expect(
      screen.getByText('Tetap terhubung dan dapatkan informasi terbaru')
    ).toBeInTheDocument()

    // Check social media links
    const instagramLink = screen.getAllByRole('link')[0]
    expect(instagramLink).toHaveAttribute(
      'href',
      'https://instagram.com/mutari.id'
    )
    expect(instagramLink).toHaveAttribute('target', '_blank')
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer')

    const twitterLink = screen.getAllByRole('link')[1]
    expect(twitterLink).toHaveAttribute('href', 'https://x.com/mutariindonesia')
    expect(twitterLink).toHaveAttribute('target', '_blank')
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer')

    const emailLink = screen.getAllByRole('link')[2]
    expect(emailLink).toHaveAttribute('href', 'mailto:support@mutari.id')
  })
})
