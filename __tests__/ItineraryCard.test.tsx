import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { type ItineraryData } from '@/modules/ItineraryModule/module-elements/types'
import ItineraryCard from '@/modules/ItineraryModule/module-elements/ItineraryCard'

// Mock data untuk props item
const mockItem: ItineraryData = {
  title: 'Trip to Bali',
  startDate: '2025-03-01',
  endDate: '2025-03-05',
  coverImage: 'bali.jpg',
  id: 'itinerary1',
  userId: 'user1',
  isPublished: false,
  isCompleted: false,
}

jest.mock('lucide-react', () => ({
  EllipsisIcon: () => 'EllipsisIcon',
  MapPinIcon: () => 'MapPinIcon',
}))

describe('ItineraryCard Component', () => {
  it('renders the component correctly', () => {
    render(<ItineraryCard item={mockItem} />)

    expect(screen.getByText('Trip to Bali')).toBeInTheDocument()
    expect(screen.getByText('Bali')).toBeInTheDocument()
    expect(screen.getByText('4 Hari • 5 Destinasi')).toBeInTheDocument()
  })

  it('toggles the options menu when clicked', () => {
    render(<ItineraryCard item={mockItem} />)

    const menuButton = screen.getByTestId('option-btn') // Menangkap tombol menu
    fireEvent.click(menuButton) // Klik pertama untuk membuka opsi
    expect(screen.getByText('Mark as Completed')).toBeInTheDocument()

    fireEvent.click(menuButton) // Klik kedua untuk menutup opsi
    expect(screen.queryByText('Mark as Completed')).not.toBeInTheDocument()
  })
})
