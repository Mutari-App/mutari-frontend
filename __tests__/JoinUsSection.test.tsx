import React from 'react'
import { render, screen } from '@testing-library/react'
import { JoinUsSection } from '@/modules/RegisterModule/sections/JoinUsSection'

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
    const instagramLink = screen.getByRole('link', { name: '' })
    expect(instagramLink).toHaveAttribute(
      'href',
      'https://instagram.com/mutari.id'
    )
    expect(instagramLink).toHaveAttribute('target', '_blank')
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer')

    const twitterLink = screen.getAllByRole('link', { name: '' })[1]
    expect(twitterLink).toHaveAttribute('href', 'https://x.com/mutariindonesia')
    expect(twitterLink).toHaveAttribute('target', '_blank')
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer')

    const emailLink = screen.getAllByRole('link', { name: '' })[2]
    expect(emailLink).toHaveAttribute('href', 'mailto:support@mutari.id')
  })
})
