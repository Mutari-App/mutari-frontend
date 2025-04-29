import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Maps from '@/modules/ItineraryMakerModule/sections/Maps'
import type { CreateItineraryDto } from '@/modules/ItineraryMakerModule/interface'

jest.mock('lucide-react', () => ({
  Globe: () => <span data-testid="globe-icon">Globe Icon Mock</span>,
  Phone: () => <span data-testid="phone-icon">Phone Icon Mock</span>,
}))

jest.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => children,

  Map: ({
    children,
    id,
    onClick,
  }: {
    children: React.ReactNode
    id?: string
    defaultCenter?: { lat: number; lng: number }
    defaultZoom?: number
    streetViewControl?: boolean
    onClick?: (event: any) => void
    mapId?: string
    restriction?: any
  }) => (
    <div
      data-testid="mock-map"
      id={id}
      onClick={(e) => {
        // Create a proper mock event structure that matches MapMouseEvent
        if (onClick) {
          onClick({
            detail: {
              placeId: 'mock-place-id',
              latLng: { lat: -6.2, lng: 106.8 },
            },
            map: {
              panTo: jest.fn(),
              setZoom: jest.fn(),
            },
            stop: jest.fn(), // Add the stop method
          })
        }
      }}
      className="mock-map"
    >
      {children}
    </div>
  ),

  AdvancedMarker: ({
    children,
    position,
    onClick,
  }: {
    children?: React.ReactNode
    position?: google.maps.LatLngLiteral | google.maps.LatLng | null | undefined
    onClick?: () => void
    'data-testid'?: string
  }) => (
    <div
      data-testid="map-marker"
      className="mock-marker"
      onClick={onClick}
      data-lat={position?.lat}
      data-lng={position?.lng}
    >
      {children}
    </div>
  ),

  useMap: () => {
    // Return a mock map object that can be used by your components
    const mockMap = {
      panTo: jest.fn(),
      setZoom: jest.fn(),
      // Add other map methods you might use
    }

    return { map: mockMap }
  },
}))

describe('Maps Component', () => {
  const mockApiKey = 'MOCK-API-KEY'
  const mockItineraryData: CreateItineraryDto = {
    isPublished: false,
    title: 'Trip to Jakarta',
    description: 'Exploring the city',
    coverImage: 'image-url',
    startDate: '2025-04-01',
    endDate: '2025-04-05',
    tags: ['Jakarta', 'Vacation'],
    sections: [
      {
        sectionNumber: 1,
        title: 'Day 1',
        blocks: [
          {
            id: '1',
            blockType: 'visit',
            title: 'Monas',
            location: '-6.2088,106.8456',
          },
          {
            id: '2',
            blockType: 'visit',
            title: 'Kota Tua',
            location: '-6.1754,106.8272',
          },
        ],
      },
      {
        sectionNumber: 2,
        title: 'Day 2',
        blocks: [
          {
            id: '3',
            blockType: 'visit',
            title: 'Pantai Indah Kapuk',
            location: '-6.2297,106.6894',
          },
        ],
      },
    ],
  }

  const incompleteItineraryData: CreateItineraryDto = {
    ...mockItineraryData,
    sections: [
      {
        sectionNumber: 1,
        title: 'Day 1',
        blocks: [
          {
            id: '1',
            blockType: 'location',
            title: 'No Location',
            location: '',
          },
          {
            id: '2',
            blockType: 'location',
            title: 'Null Location',
            location: undefined,
          },
          {
            id: '3',
            blockType: 'location',
            title: 'Undefined Location',
            location: undefined,
          },
        ],
      },
    ],
  }

  const noBlocksItineraryData: CreateItineraryDto = {
    ...mockItineraryData,
    sections: [
      { sectionNumber: 1, title: 'Day 1', blocks: undefined },
      { sectionNumber: 2, title: 'Day 2', blocks: undefined },
      { sectionNumber: 3, title: 'Day 3', blocks: [] },
    ],
  }

  test('renders Google Map when loaded', () => {
    render(<Maps itineraryData={mockItineraryData.sections} />)
    expect(screen.getByTestId('mock-map')).toBeInTheDocument()
  })

  test('renders correct number of markers', () => {
    render(<Maps itineraryData={mockItineraryData.sections} />)
    const markers = screen.getAllByTestId('map-marker')
    expect(markers.length).toBe(3)
  })

  test('handles blocks without locations', () => {
    render(<Maps itineraryData={incompleteItineraryData.sections} />)

    expect(screen.queryByTestId('map-marker')).not.toBeInTheDocument()
  })

  test('handles sections with no blocks', () => {
    render(<Maps itineraryData={noBlocksItineraryData.sections} />)
    expect(screen.queryByTestId('map-marker')).not.toBeInTheDocument()
  })

  test('calls addLocationToSection when adding a place to itinerary', async () => {
    const addLocationToSectionMock = jest.fn()
    render(
      <Maps
        itineraryData={mockItineraryData.sections}
        isEditing
        addLocationToSection={addLocationToSectionMock}
        _testSelectedPlace={{
          placeId: 'abc123',
          latLng: { lat: -6.2, lng: 106.8 },
        }}
        _testSelectedPlaceDetails={{
          name: 'Test Place',
          vicinity: 'Jakarta',
          rating: 4.5,
          user_ratings_total: 100,
          international_phone_number: '+62 812 3456 7890',
          website: 'https://example.com',
          photos: [],
        }}
      />
    )

    // Simulate selecting a place
    fireEvent.click(screen.getByText('Tambahkan ke itinerary'))

    await waitFor(() => {
      expect(addLocationToSectionMock).toHaveBeenCalled()
    })
  })
})
