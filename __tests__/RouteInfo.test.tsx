import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { RouteInfo } from '@/modules/ItineraryMakerModule/module-elements/RouteInfo'
import { TransportMode } from '@/utils/maps'

// Mock all the Lucide icons
jest.mock('lucide-react', () => ({
  Car: () => <div data-testid="car-icon">Car</div>,
  Footprints: () => <div data-testid="walk-icon">Footprints</div>,
  Bike: () => <div data-testid="bicycle-icon">Bike</div>,
  Bus: () => <div data-testid="transit-icon">Bus</div>,
}))

// Mock the shadcn components
jest.mock('@/components/ui/select', () => ({
  Select: ({
    children,
    value,
    onValueChange,
  }: {
    children: React.ReactNode
    value: string
    onValueChange: (value: TransportMode) => void
  }) => (
    <div data-testid="select">
      <span data-testid="current-mode">{value}</span>
      <button
        data-testid="mode-drive"
        onClick={() => onValueChange(TransportMode.DRIVE)}
      >
        Select Drive
      </button>
      <button
        data-testid="mode-walk"
        onClick={() => onValueChange(TransportMode.WALK)}
      >
        Select Walk
      </button>
      <button
        data-testid="mode-bicycle"
        onClick={() => onValueChange(TransportMode.BICYCLE)}
      >
        Select Bicycle
      </button>
      <button
        data-testid="mode-transit"
        onClick={() => onValueChange(TransportMode.TRANSIT)}
      >
        Select Transit
      </button>
      {children}
    </div>
  ),
  SelectContent: ({ children }: any) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ children, value }: any) => (
    <div data-testid={`select-item-${value}`}>{children}</div>
  ),
  SelectTrigger: ({ children }: any) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: ({ children }: any) => (
    <div data-testid="select-value">{children}</div>
  ),
}))

describe('RouteInfo Component', () => {
  test('renders formatted distance and duration', () => {
    render(<RouteInfo distance={1500} duration={5400} />)
    expect(screen.getByText('1.5 km')).toBeInTheDocument()
    expect(screen.getByText('1 jam 30 menit')).toBeInTheDocument()
    // Default transport mode should be DRIVE (car)
    expect(screen.getByTestId('car-icon')).toBeInTheDocument()
  })

  test('renders meters for small distances', () => {
    render(<RouteInfo distance={500} duration={120} />)
    expect(screen.getByText('500 m')).toBeInTheDocument()
    expect(screen.getByText('2 menit')).toBeInTheDocument()
  })

  test('handles zero distance and duration gracefully', () => {
    render(<RouteInfo distance={0} duration={0} />)
    expect(screen.getByText('0 m')).toBeInTheDocument()
    expect(screen.getByText('0 menit')).toBeInTheDocument()
  })

  test('renders correctly with large duration (hours and minutes)', () => {
    render(<RouteInfo distance={2000} duration={7260} />)
    expect(screen.getByText('2.0 km')).toBeInTheDocument()
    expect(screen.getByText('2 jam 1 menit')).toBeInTheDocument()
  })

  // Transport mode tests
  test('renders specified transport mode icon - WALK', () => {
    render(
      <RouteInfo
        distance={1000}
        duration={600}
        transportMode={TransportMode.WALK}
      />
    )
    expect(screen.getByTestId('walk-icon')).toBeInTheDocument()
    expect(screen.getByText('Jalan Kaki')).toBeInTheDocument()
  })

  test('renders specified transport mode icon - BICYCLE', () => {
    render(
      <RouteInfo
        distance={1000}
        duration={600}
        transportMode={TransportMode.BICYCLE}
      />
    )
    expect(screen.getByTestId('bicycle-icon')).toBeInTheDocument()
    expect(screen.getByText('Sepeda')).toBeInTheDocument()
  })

  test('renders specified transport mode icon - TRANSIT', () => {
    render(
      <RouteInfo
        distance={1000}
        duration={600}
        transportMode={TransportMode.TRANSIT}
      />
    )
    expect(screen.getByTestId('transit-icon')).toBeInTheDocument()
    expect(screen.getAllByText('Bus')[0]).toBeInTheDocument()
  })

  // Interactive mode change tests
  test('displays dropdown when onTransportModeChange is provided', () => {
    const mockOnChange = jest.fn().mockResolvedValue(true)
    render(
      <RouteInfo
        distance={1000}
        duration={600}
        transportMode={TransportMode.DRIVE}
        onTransportModeChange={mockOnChange}
      />
    )
    expect(screen.getByTestId('select')).toBeInTheDocument()
  })

  test('calls onTransportModeChange when mode is changed', async () => {
    const mockOnChange = jest.fn().mockResolvedValue(true)
    render(
      <RouteInfo
        distance={1000}
        duration={600}
        transportMode={TransportMode.DRIVE}
        onTransportModeChange={mockOnChange}
      />
    )

    // Change to WALK mode
    fireEvent.click(screen.getByTestId('mode-walk'))

    // Check if the callback was called with WALK
    expect(mockOnChange).toHaveBeenCalledWith(TransportMode.WALK)
  })

  test('reverts to previous mode when calculation fails', async () => {
    // Mock that returns false to simulate failed calculation
    const mockOnChange = jest.fn().mockResolvedValue(false)

    render(
      <RouteInfo
        distance={1000}
        duration={600}
        transportMode={TransportMode.DRIVE}
        onTransportModeChange={mockOnChange}
      />
    )

    // Initial mode is DRIVE
    expect(screen.getByTestId('current-mode')).toHaveTextContent(
      TransportMode.DRIVE
    )

    // Try to change to BICYCLE mode
    fireEvent.click(screen.getByTestId('mode-bicycle'))

    // Wait for the promise to resolve
    await waitFor(() => {
      // Should revert back to DRIVE
      expect(screen.getByTestId('current-mode')).toHaveTextContent(
        TransportMode.DRIVE
      )
    })
  })

  test('stays on new mode when calculation succeeds', async () => {
    // Mock that returns true to simulate successful calculation
    const mockOnChange = jest.fn().mockResolvedValue(true)

    render(
      <RouteInfo
        distance={1000}
        duration={600}
        transportMode={TransportMode.DRIVE}
        onTransportModeChange={mockOnChange}
      />
    )

    // Change to WALK mode
    fireEvent.click(screen.getByTestId('mode-walk'))

    // Wait for the promise to resolve
    await waitFor(() => {
      // Should stay on WALK
      expect(screen.getByTestId('current-mode')).toHaveTextContent(
        TransportMode.WALK
      )
    })
  })

  test('handles rejected promises', async () => {
    // Mock that rejects to simulate error
    const mockOnChange = jest.fn().mockRejectedValue(new Error('Test error'))

    render(
      <RouteInfo
        distance={1000}
        duration={600}
        transportMode={TransportMode.DRIVE}
        onTransportModeChange={mockOnChange}
      />
    )

    // Initial mode is DRIVE
    expect(screen.getByTestId('current-mode')).toHaveTextContent(
      TransportMode.DRIVE
    )

    // Try to change to TRANSIT mode
    fireEvent.click(screen.getByTestId('mode-transit'))

    // Wait for the promise to reject
    await waitFor(() => {
      // Should revert back to DRIVE
      expect(screen.getByTestId('current-mode')).toHaveTextContent(
        TransportMode.DRIVE
      )
    })
  })

  test('updates displayMode when transportMode prop changes', () => {
    const { rerender } = render(
      <RouteInfo
        distance={1000}
        duration={600}
        transportMode={TransportMode.DRIVE}
      />
    )

    // Initial mode is DRIVE
    expect(screen.getByTestId('car-icon')).toBeInTheDocument()

    // Update the transportMode prop
    rerender(
      <RouteInfo
        distance={1000}
        duration={600}
        transportMode={TransportMode.BICYCLE}
      />
    )

    // Should now show BICYCLE icon
    expect(screen.getByTestId('bicycle-icon')).toBeInTheDocument()
  })
})
