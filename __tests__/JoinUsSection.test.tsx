import React from 'react'
import { render, screen } from '@testing-library/react'
import { JoinUsSection } from '@/modules/RegisterModule/sections/JoinUsSection'

jest.mock('lucide-react', () => ({
  Mail: () => <span data-testid="mail-icon">Mail Icon Mock</span>,
}))

describe('JoinUsSection', () => {
  it('should render static content correctly', () => {
    render(<JoinUsSection />)

    // Check headings and text content
    expect(screen.getByText('Bergabung Bersama Kami!')).toBeInTheDocument()
    expect(
      screen.getByText(/Mutari hadir sebagai solusi terbaik/i)
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
