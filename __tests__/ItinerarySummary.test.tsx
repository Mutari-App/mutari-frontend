import { render, screen } from '@testing-library/react'
import { ItinerarySummary } from '@/modules/DetailItineraryModule/module-elements/ItinerarySummary'

// Mocking lucide-react to prevent Jest errors
jest.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="calendar-icon">Calendar Icon Mock</span>,
}))

describe('ItinerarySummary Component', () => {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
    })

  it('renders correctly with valid startDate and endDate', () => {
    render(<ItinerarySummary startDate="2025-03-01" endDate="2025-03-09" />)

    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument()
    expect(
      screen.getByText(
        `${formatDate('2025-03-01')} - ${formatDate('2025-03-09')}`
      )
    ).toBeInTheDocument()
  })

  it('does not render when startDate is missing', () => {
    const { container } = render(
      <ItinerarySummary startDate="" endDate="2025-03-09" />
    )
    expect(container.firstChild).toBeNull()
  })

  it('does not render when endDate is missing', () => {
    const { container } = render(
      <ItinerarySummary startDate="2025-03-01" endDate="" />
    )
    expect(container.firstChild).toBeNull()
  })

  it('does not render when both startDate and endDate are missing', () => {
    const { container } = render(<ItinerarySummary startDate="" endDate="" />)
    expect(container.firstChild).toBeNull()
  })
})
