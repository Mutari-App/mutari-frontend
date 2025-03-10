import { render, screen } from '@testing-library/react'
import { ItineraryDay } from '@/modules/DetailItineraryModule/module-elements/ItineraryDay'
import React from 'react'

jest.mock('lucide-react', () => ({
  MapPin: () => <svg data-testid="icon-map-pin" />,
  Clock: () => <svg data-testid="icon-clock" />,
  Tag: () => <svg data-testid="icon-tag" />,
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
        location: 'Bali',
        price: 100,
        photoUrl: 'https://example.com/photo1.jpg',
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
        location: 'Los Angeles',
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
    expect(screen.getByText('Bali')).toBeInTheDocument()
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
    expect(screen.getByText('Los Angeles')).toBeInTheDocument()
    expect(screen.getByText('Rp200')).toBeInTheDocument()
    expect(screen.getByText('Block Description 2')).toBeInTheDocument()
  })

  it('renders Lucide icons correctly', () => {
    render(<ItineraryDay section={mockSection[0]} />)
    expect(screen.getByTestId('icon-map-pin')).toBeInTheDocument()
    expect(screen.getByTestId('icon-clock')).toBeInTheDocument()
    expect(screen.getByTestId('icon-tag')).toBeInTheDocument()
  })
})
