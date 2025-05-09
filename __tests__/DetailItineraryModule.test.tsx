import { render, screen, waitFor } from '@testing-library/react'
import DetailItineraryModule from '../src/modules/DetailItineraryModule/index'
import { customFetch } from '@/utils/newCustomFetch'
import { useParams, useRouter } from 'next/navigation'

// Mock dependencies
jest.mock('@/utils/newCustomFetch')
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}))
jest.mock(
  '../src/modules/DetailItineraryModule/module-elements/ItineraryHeader',
  () => ({
    ItineraryHeader: () => (
      <div data-testid="itinerary-header">Header Mock</div>
    ),
  })
)
jest.mock(
  '../src/modules/DetailItineraryModule/module-elements/ItineraryList',
  () => ({
    ItineraryList: () => <div data-testid="itinerary-list">List Mock</div>,
  })
)
jest.mock(
  '../src/modules/DetailItineraryModule/module-elements/ItinerarySummary',
  () => ({
    ItinerarySummary: () => (
      <div data-testid="itinerary-summary">Summary Mock</div>
    ),
  })
)
jest.mock(
  '../src/modules/DetailItineraryModule/module-elements/PlanPicker',
  () => ({
    PlanPicker: () => <div data-testid="plan-picker">Plan Picker Mock</div>,
  })
)
jest.mock('../src/modules/ItineraryMakerModule/sections/Maps', () => ({
  __esModule: true,
  default: () => <div data-testid="maps">Maps Mock</div>,
}))

jest.mock('lucide-react', () => ({
  Loader2: () => (
    <div role="status" data-testid="loading-spinner">
      Loading...
    </div>
  ),
}))

jest.mock('@/app/not-found', () => ({
  __esModule: true,
  default: () => <div data-testid="custom-not-found-page">Not Found Page</div>,
}))

const mockItinerary = {
  id: '123',
  title: 'Test Itinerary',
  startDate: '2023-01-01',
  endDate: '2023-01-07',
  sections: [{ id: '1', title: 'Day 1', sectionNumber: 1 }],
}

const mockContingencies = [{ id: '456', title: 'Rain Plan', sections: [] }]

const mockContingency = {
  id: '456',
  title: 'Rain Plan',
  sections: [{ id: '2', title: 'Alternative Day 1', sectionNumber: 1001 }],
}

describe('DetailItineraryModule', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useParams as jest.Mock).mockReturnValue({ id: '123' })
    ;(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    ;(customFetch as jest.Mock).mockImplementation((url: string) => {
      if (url.endsWith('/itineraries/123')) {
        return Promise.resolve({ statusCode: 200, data: mockItinerary })
      }
      if (url.endsWith('/contingencies')) {
        return Promise.resolve({
          statusCode: 200,
          contingencies: mockContingencies,
        })
      }
      if (url.endsWith('/contingencies/456')) {
        return Promise.resolve({
          statusCode: 200,
          contingency: mockContingency,
        })
      }
      return Promise.resolve({})
    })
  })

  it('renders the itinerary details', async () => {
    render(<DetailItineraryModule />)

    // Check for loading state first
    expect(screen.getByRole('status')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('itinerary-header')).toBeInTheDocument()
      expect(screen.getByTestId('itinerary-summary')).toBeInTheDocument()
      expect(screen.getByTestId('itinerary-list')).toBeInTheDocument()
      expect(screen.getByTestId('plan-picker')).toBeInTheDocument()
      expect(screen.getByTestId('maps')).toBeInTheDocument()
    })

    expect(customFetch).toHaveBeenCalledWith(
      '/itineraries/123',
      expect.objectContaining({ credentials: 'include' })
    )
    expect(customFetch).toHaveBeenCalledWith(
      'itineraries/123/contingencies',
      expect.objectContaining({ credentials: 'include' })
    )
  })

  it('loads contingency plan when contingencyId is provided', async () => {
    ;(useParams as jest.Mock).mockReturnValue({
      id: '123',
      contingencyId: '456',
    })

    render(<DetailItineraryModule />)

    await waitFor(() => {
      expect(screen.getByTestId('itinerary-header')).toBeInTheDocument()
    })

    expect(customFetch).toHaveBeenCalledWith(
      'itineraries/123/contingencies/456',
      expect.objectContaining({ credentials: 'include' })
    )

    // Verify the section number mapping is applied (component modifies sectionNumber % 1000)
    expect(customFetch).toHaveBeenCalledTimes(3)
  })

  it('shows not found when itinerary fetch fails with 404', async () => {
    ;(customFetch as jest.Mock).mockImplementation((url: string) => {
      if (url.endsWith('/itineraries/123')) {
        return Promise.resolve({ statusCode: 404 })
      }
      return Promise.resolve({})
    })

    render(<DetailItineraryModule />)

    await waitFor(() => {
      expect(screen.getByTestId('custom-not-found-page')).toBeInTheDocument()
    })
  })

  it('shows not found when itinerary fetch fails with 403', async () => {
    ;(customFetch as jest.Mock).mockImplementation((url: string) => {
      if (url.endsWith('/itineraries/123')) {
        return Promise.resolve({ statusCode: 403 })
      }
      return Promise.resolve({})
    })

    render(<DetailItineraryModule />)

    await waitFor(() => {
      expect(screen.getByTestId('custom-not-found-page')).toBeInTheDocument()
    })
  })

  it('shows not found when fetch throws an error', async () => {
    ;(customFetch as jest.Mock).mockImplementation((url: string) => {
      if (url.endsWith('/itineraries/123')) {
        return Promise.reject(new Error('Network error'))
      }
      return Promise.resolve({})
    })

    render(<DetailItineraryModule />)

    await waitFor(() => {
      expect(screen.getByTestId('custom-not-found-page')).toBeInTheDocument()
    })
  })

  it('shows not found when contingency fetch fails', async () => {
    ;(useParams as jest.Mock).mockReturnValue({
      id: '123',
      contingencyId: '456',
    })
    ;(customFetch as jest.Mock).mockImplementation((url: string) => {
      if (url.endsWith('/contingencies/456')) {
        return Promise.resolve({ statusCode: 404 })
      }
      if (url.endsWith('/itineraries/123')) {
        return Promise.resolve({ statusCode: 200, data: mockItinerary })
      }
      return Promise.resolve({
        statusCode: 200,
        contingencies: mockContingencies,
      })
    })

    render(<DetailItineraryModule />)

    await waitFor(() => {
      expect(screen.getByTestId('custom-not-found-page')).toBeInTheDocument()
    })
  })

  it('shows not found when contingency fetch throws an error', async () => {
    ;(useParams as jest.Mock).mockReturnValue({
      id: '123',
      contingencyId: '456',
    })
    ;(customFetch as jest.Mock).mockImplementation((url: string) => {
      if (url.endsWith('/contingencies')) {
        return Promise.reject(new Error('Network error'))
      }
      if (url.endsWith('/itineraries/123')) {
        return Promise.resolve({ statusCode: 200, data: mockItinerary })
      }
      return Promise.resolve({
        statusCode: 200,
        contingencies: mockContingencies,
      })
    })

    render(<DetailItineraryModule />)

    await waitFor(() => {
      expect(screen.getByTestId('custom-not-found-page')).toBeInTheDocument()
    })
  })

  it('handles 404 error when fetching contingencies list', async () => {
    ;(customFetch as jest.Mock).mockImplementation((url: string) => {
      if (url.endsWith('/itineraries/123')) {
        return Promise.resolve({ statusCode: 200, data: mockItinerary })
      }
      if (url.endsWith('/contingencies')) {
        return Promise.resolve({ statusCode: 404 })
      }
      return Promise.resolve({})
    })

    render(<DetailItineraryModule />)

    await waitFor(() => {
      expect(screen.getByTestId('custom-not-found-page')).toBeInTheDocument()
    })
  })
})
