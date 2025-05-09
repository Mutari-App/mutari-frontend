import { render, screen } from '@testing-library/react'
import { TourOrderCard } from '@/modules/DetailTourModule/module-elements/TourOrderCard'

describe('TourOrderCard', () => {
  it('displays the price per ticket correctly', () => {
    render(<TourOrderCard pricePerTicket={250000} />)
    expect(screen.getByText('Rp250000')).toBeInTheDocument()
    expect(screen.getByText('/ pax')).toBeInTheDocument()
  })

  it('renders the "Pesan Sekarang" button', () => {
    render(<TourOrderCard pricePerTicket={250000} />)
    const button = screen.getByRole('button', { name: /Pesan Sekarang/i })
    expect(button).toBeInTheDocument()
  })
})
