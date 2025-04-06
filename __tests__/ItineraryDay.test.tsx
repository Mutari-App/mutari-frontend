import { render, screen } from '@testing-library/react'
import { ItineraryDay } from '@/modules/DetailItineraryModule/module-elements/ItineraryDay'
import React from 'react'
import { TransportMode } from '@/utils/maps'

jest.mock('lucide-react', () => ({
  MapPin: () => <svg data-testid="icon-map-pin" />,
  Clock: () => <svg data-testid="icon-clock" />,
  Tag: () => <svg data-testid="icon-tag" />,
  Car: () => <svg data-testid="icon-car" />,
  Footprints: () => <svg data-testid="icon-footprints" />,
  Bike: () => <svg data-testid="icon-bike" />,
  Bus: () => <svg data-testid="icon-bus" />,
}))

jest.mock('@/icons/Motorcycle', () => ({
  Motorcycle: () => <svg data-testid="icon-motorcycle" />,
}))

const mockSection = [
  {
    id: 'section1',
    itineraryId: 'ITN-123',
    sectionNumber: 1,
    updatedAt: '2022-04-03T10:00:00Z',
    createdAt: '2022-04-03T10:00:00Z',
    title: 'Section 1',
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
          distance: 5000, // 5 km
          duration: 3600, // 1 hour
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
        blockType: 'LOCATION',
        startTime: '2022-04-03T14:00:00Z',
        endTime: '2022-04-03T16:00:00Z',
        location: '0,0',
        price: 150,
        photoUrl: 'https://example.com/photo2.jpg',
        routeToNext: {
          id: 'route2',
          createdAt: '2022-04-03T16:00:00Z',
          updatedAt: '2022-04-03T16:00:00Z',
          sourceBlockId: 'block2',
          destinationBlockId: 'block3',
          distance: 1200, // 1.2 km
          duration: 900, // 15 minutes
          polyline: 'encoded_polyline_data_2',
          transportMode: TransportMode.WALK,
        },
      },
      {
        id: 'block3',
        updatedAt: '2022-04-03T17:00:00Z',
        createdAt: '2022-04-03T17:00:00Z',
        title: 'Block Title 3',
        description: 'Block Description 3',
        sectionId: 'section1',
        position: 3,
        blockType: 'LOCATION',
        startTime: '2022-04-03T17:00:00Z',
        endTime: '2022-04-03T19:00:00Z',
        location: '0,0',
        price: 200,
        photoUrl: 'https://example.com/photo3.jpg',
        // Last block doesn't have routeToNext
      },
    ],
  },
  {
    id: 'section2',
    itineraryId: 'ITN-123',
    sectionNumber: 2,
    updatedAt: '2022-04-04T11:00:00Z',
    createdAt: '2022-04-04T11:00:00Z',
    title: 'Section 2',
    blocks: [
      {
        id: 'block2',
        updatedAt: '2022-04-04T11:00:00Z',
        createdAt: '2022-04-04T11:00:00Z',
        title: 'Block Title 2',
        description: 'Block Description 2',
        sectionId: 'section2',
        position: 2,
        blockType: 'LOCATION',
        startTime: '2022-04-04T14:00:00Z',
        endTime: '2022-04-04T16:00:00Z',
        location: '0,0',
        price: 200,
        photoUrl: 'https://example.com/photo2.jpg',
      },
    ],
  },
]

describe('ItineraryDay Component', () => {
  it('renders the section title correctly', () => {
    render(<ItineraryDay section={mockSection[0]} />)
    expect(screen.getByText('Section 1')).toBeInTheDocument()
  })

  it('renders location details correctly', () => {
    render(<ItineraryDay section={mockSection[0]} />)
    expect(screen.getByText('Block Title 1')).toBeInTheDocument()
    expect(screen.getByText('Rp100')).toBeInTheDocument()
  })

  it('displays formatted time correctly', () => {
    render(<ItineraryDay section={mockSection[0]} />)
    // Get the expected formatted time
    const formattedStartTime = new Date(
      mockSection[0].blocks[0].startTime
    ).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    const formattedEndTime = new Date(
      mockSection[0].blocks[0].endTime
    ).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    expect(
      screen.getByText(`${formattedStartTime} - ${formattedEndTime}`)
    ).toBeInTheDocument()
  })

  it('renders the description correctly', () => {
    render(<ItineraryDay section={mockSection[0]} />)
    expect(screen.getByText('Block Description 1')).toBeInTheDocument()
  })

  it('renders multiple sections correctly', () => {
    render(<ItineraryDay section={mockSection[1]} />)
    expect(screen.getByText('Section 2')).toBeInTheDocument()
    expect(screen.getByText('Block Title 2')).toBeInTheDocument()
    expect(screen.getByText('Rp200')).toBeInTheDocument()
    expect(screen.getByText('Block Description 2')).toBeInTheDocument()
  })

  it('renders RouteInfo component when routeToNext exists', () => {
    render(<ItineraryDay section={mockSection[0]} />)
    expect(screen.getByText('1 jam 0 menit')).toBeInTheDocument()
    expect(screen.getByText('5.0 km')).toBeInTheDocument()
    expect(screen.getByTestId('icon-car')).toBeInTheDocument()
  })

  it('renders RouteInfo with different transport modes correctly', () => {
    render(<ItineraryDay section={mockSection[0]} />)
    expect(screen.getByTestId('icon-car')).toBeInTheDocument()
    expect(screen.getByText('15 menit')).toBeInTheDocument()
    expect(screen.getByText('1.2 km')).toBeInTheDocument()
    expect(screen.getByTestId('icon-footprints')).toBeInTheDocument()
  })

  it('does not render RouteInfo for the last block in a section', () => {
    render(<ItineraryDay section={mockSection[0]} />)

    // We should have only 2 bullets (one for each non-last block's route)
    const bulletPoints = screen.getAllByText('•')
    expect(bulletPoints.length).toBe(2)
  })
})
