import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { RouteInfo } from '@/modules/DetailItineraryModule/module-elements/RouteInfo'
import { TransportMode } from '@/utils/maps'

// Mock the icons
jest.mock('lucide-react', () => ({
  Car: () => <div data-testid="car-icon">Car</div>,
  Footprints: () => <div data-testid="footprints-icon">Footprints</div>,
  Bike: () => <div data-testid="bike-icon">Bike</div>,
  Bus: () => <div data-testid="bus-icon">Bus</div>,
}))

jest.mock('@/icons/Motorcycle', () => ({
  Motorcycle: () => <div data-testid="motorcycle-icon">Motorcycle</div>,
}))

describe('RouteInfo Component', () => {
  test('renders with default props (drive mode)', () => {
    render(<RouteInfo distance={1500} duration={300} />)

    // Check if car icon is displayed (default transport mode)
    expect(screen.getByTestId('car-icon')).toBeInTheDocument()

    // Check if distance and duration are formatted correctly
    expect(screen.getByText('1.5 km')).toBeInTheDocument()
    expect(screen.getByText('5 menit')).toBeInTheDocument()
  })

  test('renders with walk transport mode', () => {
    render(
      <RouteInfo
        distance={800}
        duration={900}
        transportMode={TransportMode.WALK}
      />
    )

    expect(screen.getByTestId('footprints-icon')).toBeInTheDocument()
    expect(screen.getByText('800 m')).toBeInTheDocument()
    expect(screen.getByText('15 menit')).toBeInTheDocument()
  })

  test('renders with bicycle transport mode', () => {
    render(
      <RouteInfo
        distance={2500}
        duration={600}
        transportMode={TransportMode.BICYCLE}
      />
    )

    expect(screen.getByTestId('bike-icon')).toBeInTheDocument()
    expect(screen.getByText('2.5 km')).toBeInTheDocument()
    expect(screen.getByText('10 menit')).toBeInTheDocument()
  })

  test('renders with transit transport mode', () => {
    render(
      <RouteInfo
        distance={10000}
        duration={1800}
        transportMode={TransportMode.TRANSIT}
      />
    )

    expect(screen.getByTestId('bus-icon')).toBeInTheDocument()
    expect(screen.getByText('10.0 km')).toBeInTheDocument()
    expect(screen.getByText('30 menit')).toBeInTheDocument()
  })

  test('renders with two wheeler transport mode', () => {
    render(
      <RouteInfo
        distance={5000}
        duration={900}
        transportMode={TransportMode.TWO_WHEELER}
      />
    )

    expect(screen.getByTestId('motorcycle-icon')).toBeInTheDocument()
    expect(screen.getByText('5.0 km')).toBeInTheDocument()
    expect(screen.getByText('15 menit')).toBeInTheDocument()
  })

  test('formats duration with hours correctly', () => {
    render(
      <RouteInfo
        distance={20000}
        duration={5400} // 1 hour and 30 minutes
        transportMode={TransportMode.DRIVE}
      />
    )

    expect(screen.getByText('1 jam 30 menit')).toBeInTheDocument()
  })

  test('handles unexpected transport mode by defaulting to car', () => {
    render(
      <RouteInfo distance={1000} duration={300} transportMode="INVALID_MODE" />
    )

    expect(screen.getByTestId('car-icon')).toBeInTheDocument()
  })
})
