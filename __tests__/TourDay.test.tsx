import { render, screen } from '@testing-library/react'
import { TourDay } from '@/modules/DetailTourModule/module-elements/TourDay'
import { TransportMode } from '@/utils/maps'

jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin" />,
  Clock: () => <div data-testid="clock-icon" />,
}))

const mockSection = {
  id: 'section1',
  itineraryId: 'ITN-123',
  sectionNumber: 1,
  updatedAt: '2022-04-03T10:00:00Z',
  createdAt: '2022-04-03T10:00:00Z',
  title: 'Section 1',
  contingencyPlanId: null,
  blocks: [
    {
      id: 'block1',
      updatedAt: '2022-04-03T10:00:00Z',
      createdAt: '2022-04-03T10:00:00Z',
      title: 'Block Title 1',
      description: 'Block Description 1',
      sectionId: 'section1',
      position: 1,
      blockType: 'LOCATION',
      startTime: '2022-04-03T10:00:00Z',
      endTime: '2022-04-03T12:00:00Z',
      location: '0,0',
      price: 100,
      photoUrl: 'https://example.com/photo1.jpg',
      routeToNext: {
        id: 'route1',
        createdAt: '2022-04-03T12:00:00Z',
        updatedAt: '2022-04-03T12:00:00Z',
        sourceBlockId: 'block1',
        destinationBlockId: 'block2',
        distance: 5000,
        duration: 3600,
        polyline: 'encoded_polyline_data',
        transportMode: TransportMode.DRIVE,
      },
    },
    {
      id: 'block2',
      updatedAt: '2022-04-03T14:00:00Z',
      createdAt: '2022-04-03T14:00:00Z',
      title: 'Block Title 2',
      description: 'Block Description 2',
      sectionId: 'section1',
      position: 2,
      blockType: 'NOTE',
      startTime: '',
      endTime: '',
      location: '',
      price: 0,
      photoUrl: '',
    },
  ],
}

const formatTime = (time: string) =>
  new Date(time).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

describe('TourDay', () => {
  it('renders MapPin icon when sectionNumber is 1', () => {
    render(<TourDay section={mockSection} />)
    expect(screen.getByTestId('map-pin')).toBeInTheDocument()
  })

  it('renders the section title', () => {
    render(<TourDay section={mockSection} />)
    expect(screen.getByText('Section 1')).toBeInTheDocument()
  })

  it('renders LOCATION block with title, times, and description', () => {
    render(<TourDay section={mockSection} />)

    const start = formatTime(mockSection.blocks[0].startTime)
    const end = formatTime(mockSection.blocks[0].endTime)

    expect(screen.getByText('Block Title 1')).toBeInTheDocument()
    expect(screen.getByText('Block Description 1')).toBeInTheDocument()
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
    expect(screen.getByText(`${start} - ${end}`)).toBeInTheDocument()
  })

  it('renders NOTE block with description only', () => {
    render(<TourDay section={mockSection} />)
    expect(screen.getByText('Block Description 2')).toBeInTheDocument()
  })
})
