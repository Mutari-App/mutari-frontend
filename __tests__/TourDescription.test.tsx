import { render, screen, fireEvent } from '@testing-library/react'
import { TourDescription } from '@/modules/DetailTourModule/module-elements/TourDescription'

jest.mock('lucide-react', () => ({
  UsersRound: () => <div data-testid="users-icon" />,
}))

const mockProps = {
  title: ' Amazing Bali Tour',
  description: 'blublublublub',
  maxCapacity: 12,
}

describe('TourDescription', () => {
  it('renders title and maxCapacity text', () => {
    render(<TourDescription {...mockProps} />)
    expect(screen.getByText('Amazing Bali Tour')).toBeInTheDocument()
    expect(screen.getByTestId('users-icon')).toBeInTheDocument()
    expect(screen.getByText(/Open trip sampai 12 orang/)).toBeInTheDocument()
  })

  it('shows short description by default', () => {
    render(<TourDescription {...mockProps} />)
    const shortDesc =
      mockProps.description.split(' ').slice(0, 30).join(' ') + '...'
    expect(screen.getByText(shortDesc)).toBeInTheDocument()
    expect(screen.getByText('Tampilkan deskripsi')).toBeInTheDocument()
  })

  it('toggles to full description on button click', () => {
    render(<TourDescription {...mockProps} />)
    const button = screen.getByRole('button', { name: 'Tampilkan deskripsi' })

    fireEvent.click(button)

    expect(screen.getByText(mockProps.description)).toBeInTheDocument()
    expect(screen.getByText('Sembunyikan deskripsi')).toBeInTheDocument()
  })

  it('toggles back to short description on second click', () => {
    render(<TourDescription {...mockProps} />)
    const button = screen.getByRole('button', { name: 'Tampilkan deskripsi' })

    fireEvent.click(button) // Expand
    fireEvent.click(button) // Collapse

    const shortDesc =
      mockProps.description.split(' ').slice(0, 30).join(' ') + '...'
    expect(screen.getByText(shortDesc)).toBeInTheDocument()
    expect(screen.getByText('Tampilkan deskripsi')).toBeInTheDocument()
  })
})
