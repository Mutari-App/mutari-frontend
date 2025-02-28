import { render } from '@testing-library/react'
import ItineraryModule from '@/modules/ItineraryModule'

it('renders itinerary page unchanged', () => {
  const { container } = render(<ItineraryModule />)
  expect(container).toMatchSnapshot()
})
