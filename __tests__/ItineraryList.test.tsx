import { render, screen } from '@testing-library/react'
import { ItineraryList } from '@/modules/DetailItineraryModule/module-elements/ItineraryList'
import React from 'react'

jest.mock(
  '@/modules/DetailItineraryModule/module-elements/ItineraryDay',
  () => ({
    ItineraryDay: jest.fn(() => <div data-testid="itinerary-day" />),
  })
)

const mockSections = [
  {
    id: 'section1',
    itineraryId: 'ITN-123',
    sectionNumber: 1,
    updatedAt: '03-04-2022',
    createdAt: '03-04-2022',
    title: 'Section 1',
    contingencyPlanId: null,
    blocks: [
      {
        id: 'block1',
        updatedAt: '03-04-2022',
        createdAt: '03-04-2022',
        title: 'Block Title 1',
        description: 'Block Description 1',
        sectionId: 'section1',
        position: 1,
        blockType: 'LOCATION',
        startTime: '03-04-2022',
        endTime: '03-04-2022',
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
    updatedAt: '04-04-2022',
    createdAt: '04-04-2022',
    title: 'Section 2',
    contingencyPlanId: null,
    blocks: [
      {
        id: 'block2',
        updatedAt: '04-04-2022',
        createdAt: '04-04-2022',
        title: 'Block Title 2',
        description: 'Block Description 2',
        sectionId: 'section2',
        position: 2,
        blockType: 'LOCATION',
        startTime: '04-04-2022',
        endTime: '04-04-2022',
        location: 'Los Angeles',
        price: 200,
        photoUrl: 'https://example.com/photo2.jpg',
      },
    ],
  },
]

describe('ItineraryList Component', () => {
  it('renders without crashing when sections are provided', () => {
    render(<ItineraryList section={mockSections} />)
    expect(screen.getAllByTestId('itinerary-day')).toHaveLength(2)
  })

  it('returns null when sections are empty', () => {
    const { container } = render(<ItineraryList section={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
