import { render, screen } from '@testing-library/react'
import { ItineraryHeader } from '@/modules/DetailItineraryModule/module-elements/ItineraryHeader'
import React from 'react'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => (
    <img alt={((props as { alt: string }).alt as string) || ''} {...props} />
  ),
}))

jest.mock('@/utils/getImage', () => ({
  getImage: jest.fn(() => '/default-image.jpg'),
}))

const mockData = {
  userId: 'USR-123',
  id: 'ITN-123',
  title: 'Trip to Bali',
  description: 'A fun trip to Bali!',
  coverImage: 'https://example.com/bali.jpg',
  startDate: '2025-06-10',
  endDate: '2025-06-15',
  isPublished: true,
  isCompleted: false,
  updatedAt: '2025-06-10',
  createdAt: '2025-06-15',
  tags: [],
  sections: [
    {
      id: 'section1',
      itineraryId: 'ITN-123',
      sectionNumber: 1,
      updatedAt: '03-04-2022',
      createdAt: '03-04-2022',
      title: 'Section 1',
      blocks: [
        {
          id: 'block1',
          updatedAt: '03-04-2022',
          createdAt: '03-04-2022',
          title: 'Block Title',
          description: 'Block Description',
          sectionId: 'section1',
          position: 1,
          blockType: 'LOCATION',
          startTime: '03-04-2022',
          endTime: '03-04-2022',
          location: 'New York',
          price: 100,
          photoUrl: 'https://example.com/photo.jpg',
        },
      ],
    },
  ],
}

describe('ItineraryHeader Component', () => {
  it('renders title and description correctly', () => {
    render(<ItineraryHeader data={mockData} />)
    expect(screen.getByText('Trip to Bali')).toBeInTheDocument()
    expect(screen.getByText('A fun trip to Bali!')).toBeInTheDocument()
  })

  it('renders the edit button', () => {
    render(<ItineraryHeader data={mockData} />)
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })
})
