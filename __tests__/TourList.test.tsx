import { render, screen } from '@testing-library/react'
import { TourList } from '@/modules/DetailTourModule/module-elements/TourList'
import { TransportMode } from '@/utils/maps'
import '@testing-library/jest-dom'

jest.mock('@/modules/DetailTourModule/module-elements/TourDay', () => ({
  TourDay: ({ section }: { section: { title: string } }) => (
    <div data-testid="tour-day">{section.title}</div>
  ),
}))

const mockSections = [
  {
    id: 'section1',
    itineraryId: 'ITN-001',
    sectionNumber: 1,
    title: 'Arrival Day',
    updatedAt: '2022-04-03T10:00:00Z',
    createdAt: '2022-04-03T10:00:00Z',
    contingencyPlanId: null,
    blocks: [
      {
        id: 'block1',
        title: 'Airport',
        description: 'Arrival at the airport',
        updatedAt: '2022-04-03T10:00:00Z',
        createdAt: '2022-04-03T10:00:00Z',
        sectionId: 'section1',
        position: 1,
        blockType: 'LOCATION',
        startTime: '2022-04-03T10:00:00Z',
        endTime: '2022-04-03T12:00:00Z',
        location: '0,0',
        price: 0,
        photoUrl: '',
        routeToNext: {
          id: 'route1',
          createdAt: '2022-04-03T12:00:00Z',
          updatedAt: '2022-04-03T12:00:00Z',
          sourceBlockId: 'block1',
          destinationBlockId: 'block2',
          distance: 1000,
          duration: 600,
          polyline: '',
          transportMode: TransportMode.WALK,
        },
      },
    ],
  },
  {
    id: 'section2',
    itineraryId: 'ITN-001',
    sectionNumber: 2,
    title: 'Tour Day',
    updatedAt: '2022-04-04T10:00:00Z',
    createdAt: '2022-04-04T10:00:00Z',
    contingencyPlanId: null,
    blocks: [],
  },
]

describe('TourList', () => {
  it('renders nothing when section is empty', () => {
    const { container } = render(<TourList section={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders TourDay components for each section', () => {
    render(<TourList section={mockSections} />)
    const tourDays = screen.getAllByTestId('tour-day')
    expect(tourDays).toHaveLength(2)
    expect(tourDays[0]).toHaveTextContent('Arrival Day')
    expect(tourDays[1]).toHaveTextContent('Tour Day')
  })
})
