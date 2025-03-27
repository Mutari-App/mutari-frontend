import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { RouteInfo } from '@/modules/ItineraryMakerModule/module-elements/RouteInfo'

jest.mock('lucide-react', () => ({
  Car: () => 'Car',
}))

describe('RouteInfo Component', () => {
  test('renders formatted distance and duration', () => {
    render(<RouteInfo distance={1500} duration={5400} />)

    // Check that formatted distance and duration are displayed
    expect(screen.getByText('1.5 km')).toBeInTheDocument()
    expect(screen.getByText('1 jam 30 menit')).toBeInTheDocument()
  })

  test('renders meters for small distances', () => {
    render(<RouteInfo distance={500} duration={120} />)

    // Check that distance is displayed in meters
    expect(screen.getByText('500 m')).toBeInTheDocument()

    // Check that duration is displayed in minutes
    expect(screen.getByText('2 menit')).toBeInTheDocument()
  })

  test('handles zero distance and duration gracefully', () => {
    render(<RouteInfo distance={0} duration={0} />)

    // Check that 0 m and 0 menit are displayed
    expect(screen.getByText('0 m')).toBeInTheDocument()
    expect(screen.getByText('0 menit')).toBeInTheDocument()
  })

  test('renders correctly with large duration (hours and minutes)', () => {
    render(<RouteInfo distance={2000} duration={7260} />)

    // Check formatted distance and duration
    expect(screen.getByText('2.0 km')).toBeInTheDocument()
    expect(screen.getByText('2 jam 1 menit')).toBeInTheDocument()
  })
})
