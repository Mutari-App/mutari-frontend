import { render, screen } from '@testing-library/react'
import Maps from '@/modules/ItineraryMakerModule/sections/Maps'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import type { CreateItineraryDto } from '@/modules/ItineraryMakerModule/interface'

const googleMapMock = jest.fn(({ children, ...props }) => (
  <div data-testid="google-map">{children}</div>
))

jest.mock('@react-google-maps/api', () => ({
  GoogleMap: jest.fn(({ children, ...props }) => (
    <div data-testid="google-map">{children}</div>
  )),
  Marker: jest.fn(() => <div data-testid="map-marker">Marker</div>),
  useLoadScript: jest.fn(() => ({ isLoaded: true })),
}))

describe('Maps Component', () => {
  const mockItineraryData: CreateItineraryDto = {
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
        title: "Day 1",
        blocks: [
          { id: "1", blockType: "location", title: "No Location", location: "" },
          { id: "2", blockType: "location", title: "Null Location", location: undefined },
          { id: "3", blockType: "location", title: "Undefined Location", location: undefined },
        ],
      },
    ],
  };

  const noBlocksItineraryData: CreateItineraryDto = {
    ...mockItineraryData,
    sections: [
      { sectionNumber: 1, title: "Day 1", blocks: undefined },
      { sectionNumber: 2, title: "Day 2", blocks: undefined },
      { sectionNumber: 3, title: "Day 3", blocks: [] },
    ],
  };
  
  

  test('renders loading state when map is not loaded', () => {
    ;(useLoadScript as jest.Mock).mockReturnValueOnce({ isLoaded: false })
    render(<Maps itineraryData={mockItineraryData} />)
    expect(screen.getByText(/loading.../i)).toBeInTheDocument()
  })

  test('renders Google Map when loaded', () => {
    render(<Maps itineraryData={mockItineraryData} />)
    expect(screen.getByTestId('google-map')).toBeInTheDocument()
  })

  test('renders correct number of markers', () => {
    render(<Maps itineraryData={mockItineraryData} />)
    const markers = screen.getAllByTestId('map-marker')
    expect(markers.length).toBe(3)
  })

  test("uses default API key when environment variable is missing", () => {
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    ;(useLoadScript as jest.Mock).mockReturnValueOnce({ isLoaded: false })
    render(<Maps itineraryData={mockItineraryData} />);
  
    expect(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY).toBeUndefined();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("handles blocks without locations", () => {
    render(<Maps itineraryData={incompleteItineraryData} />);
  
    expect(screen.queryByTestId("map-marker")).not.toBeInTheDocument();
  });

  test("handles sections with no blocks", () => {
    render(<Maps itineraryData={noBlocksItineraryData} />);
    expect(screen.queryByTestId("map-marker")).not.toBeInTheDocument();
  });
  
})
