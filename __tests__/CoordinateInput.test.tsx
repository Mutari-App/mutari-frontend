import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CoordinateInput } from '@/modules/ItineraryMakerModule/module-elements/CoordinateInput'
import '@testing-library/jest-dom'

jest.mock('lucide-react', () => ({
  MapPin: () => 'MapPin',
  X: () => 'X',
}))

describe('CoordinateInput Component', () => {
  const mockToggleInput = jest.fn()
  const mockUpdateBlock = jest.fn()
  const blockId = 'test-block-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders the "Set Koordinat" button when not visible', () => {
    render(
      <CoordinateInput
        blockId={blockId}
        isVisible={false}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
      />
    )

    const setCoordinateButton = screen.getByRole('button', {
      name: /Set Koordinat/i,
    })
    expect(setCoordinateButton).toBeInTheDocument()

    fireEvent.click(setCoordinateButton)
    expect(mockToggleInput).toHaveBeenCalledWith(blockId, 'location')
  })

  test('renders the coordinate input field when visible', () => {
    render(
      <CoordinateInput
        blockId={blockId}
        isVisible={true}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
      />
    )

    expect(screen.getByPlaceholderText('0,0')).toBeInTheDocument()

    // Check for close button
    const closeButton = screen.getByRole('button', { name: 'X' })
    expect(closeButton).toBeInTheDocument()

    fireEvent.click(closeButton)
    expect(mockToggleInput).toHaveBeenCalledWith(blockId, 'location')
  })

  test('calls updateBlock when location value changes', () => {
    render(
      <CoordinateInput
        blockId={blockId}
        isVisible={true}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
      />
    )

    const locationInput = screen.getByPlaceholderText('0,0')
    fireEvent.change(locationInput, { target: { value: '123.456,78.910' } })

    expect(mockUpdateBlock).toHaveBeenCalledWith(
      blockId,
      'location',
      '123.456,78.910'
    )
  })

  test('displays the current location value when provided', () => {
    const currentLocation = '-8.65,115.2167'

    render(
      <CoordinateInput
        blockId={blockId}
        location={currentLocation}
        isVisible={true}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
      />
    )

    const locationInput = screen.getByPlaceholderText('0,0')
    expect(locationInput).toHaveValue(currentLocation)
  })

  test('handles empty location input correctly', () => {
    render(
      <CoordinateInput
        blockId={blockId}
        isVisible={true}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        location="-8.65,115.2167"
      />
    )

    const locationInput = screen.getByPlaceholderText('0,0')

    // Clear the input
    fireEvent.change(locationInput, { target: { value: '' } })

    expect(mockUpdateBlock).toHaveBeenCalledWith(blockId, 'location', '')
  })
})
