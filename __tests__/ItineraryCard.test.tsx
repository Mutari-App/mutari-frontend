import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { customFetch } from '@/utils/customFetch'
import { type ItineraryData } from '@/modules/ItineraryModule/module-elements/types'
import ItineraryCard from '@/modules/ItineraryModule/module-elements/ItineraryCard'
import { toast } from 'sonner'
import { ImageProps } from 'next/image'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
}))
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }: ImageProps) => {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        {...props}
        alt={alt || ''}
        src={typeof props.src === 'string' ? props.src : ''}
      />
    )
  },
}))

// Mock data untuk props item
const mockItem: ItineraryData = {
  title: 'Trip to Bali',
  startDate: '2025-03-01',
  endDate: '2025-03-05',
  coverImage: 'https://example.com/images/bali.jpg',
  id: '1',
  userId: 'user1',
  isPublished: false,
  isCompleted: false,
  locationCount: 5,
}

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
jest.mock('@/utils/customFetch')
jest.mock('lucide-react', () => ({
  EllipsisIcon: () => 'EllipsisIcon',
  MapPinIcon: () => 'MapPinIcon',
}))

describe('ItineraryCard Component', () => {
  it('renders the component correctly', () => {
    render(<ItineraryCard item={mockItem} refresh={jest.fn} />)

    expect(screen.getByText('Trip to Bali')).toBeInTheDocument()
    expect(screen.getByText('4 Hari • 5 Destinasi')).toBeInTheDocument()
  })

  it('toggles the options menu when clicked', () => {
    render(<ItineraryCard item={mockItem} refresh={jest.fn} />)

    const menuButton = screen.getByTestId('option-btn') // Menangkap tombol menu
    fireEvent.click(menuButton) // Klik pertama untuk membuka opsi
    expect(screen.getByText('Mark as Completed')).toBeInTheDocument()

    fireEvent.click(menuButton) // Klik kedua untuk menutup opsi
    expect(screen.queryByText('Mark as Completed')).not.toBeInTheDocument()
  })

  it('calls markAsComplete and refresh when clicked', async () => {
    const mockRefresh = jest.fn()
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      itinerary: mockItem,
    })

    render(<ItineraryCard item={mockItem} refresh={mockRefresh} />)

    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Mark as Completed'))

    await waitFor(() => {
      expect(customFetch).toHaveBeenCalledWith(
        '/itineraries/1/mark-as-complete/',
        { isAuthorized: true, method: 'PATCH' }
      )
      expect(toast.success).toHaveBeenCalledWith(
        'Itinerary marked as complete!'
      )
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('shows error toast when API fails', async () => {
    ;(customFetch as jest.Mock).mockRejectedValue(
      new Error('Failed to mark as complete')
    )
    const mockRefresh = jest.fn()

    render(<ItineraryCard item={mockItem} refresh={mockRefresh} />)

    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Mark as Completed'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
      expect(mockRefresh).not.toHaveBeenCalled()
    })
  })
})
