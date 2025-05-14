import { render, screen } from '@testing-library/react'
import { TourHeader } from '@/modules/DetailTourModule/module-elements/TourHeader'

const mockTour = {
  title: 'Amazing Bali Tour',
  location: 'Bali, Indonesia',
  coverImage: 'https://example.com/bali.jpg',
}

describe('TourHeader', () => {
  it('renders title and location correctly', () => {
    render(
      <TourHeader
        title={mockTour.title}
        location={mockTour.location}
        coverImage={mockTour.coverImage}
      />
    )
    expect(screen.getByText('Amazing Bali Tour')).toBeInTheDocument()
    expect(screen.getByText('Bali, Indonesia')).toBeInTheDocument()
  })

  it('applies the correct background image when coverImage is provided', () => {
    const { container } = render(
      <TourHeader
        title={mockTour.title}
        location={mockTour.location}
        coverImage={mockTour.coverImage}
      />
    )
    const backgroundDiv = container.querySelector('div.relative')
    expect(backgroundDiv).toHaveStyle(
      `background-image: url(${mockTour.coverImage})`
    )
  })

  it('applies gradient background when coverImage is not provided', () => {
    const mockTourNoImage = {
      ...mockTour,
      coverImage: undefined,
    }
    const { container } = render(
      <TourHeader
        title={mockTourNoImage.title}
        location={mockTourNoImage.location}
        coverImage={mockTourNoImage.coverImage ?? ''}
      />
    )
    const backgroundDiv = container.querySelector('div.relative')
    expect(backgroundDiv).toHaveStyle(
      'background-image: linear-gradient(360deg, #004080, #0073E6, #60A5FA)'
    )
  })
})
