import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ItineraryBlock } from '@/modules/ItineraryMakerModule/module-elements/ItineraryBlock'
import '@testing-library/jest-dom'
import { type Block } from '@/modules/ItineraryMakerModule/interface'
import { toast } from 'sonner'
import { TransportMode } from '@/utils/maps'

// Mock the sonner toast
jest.mock('sonner', () => ({
  toast: {
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock the drag and drop library
jest.mock('@hello-pangea/dnd', () => ({
  Draggable: ({
    children,
  }: {
    children: (provided: any, snapshot: any) => React.ReactNode
  }) =>
    children(
      {
        draggableProps: { 'data-testid': 'draggable-props' },
        dragHandleProps: { 'data-testid': 'drag-handle-props' },
        innerRef: jest.fn(),
      },
      { isDragging: false }
    ),
}))

// Mock the child components
jest.mock('@/modules/ItineraryMakerModule/module-elements/TimeInput', () => ({
  TimeInput: jest.fn(
    ({
      blockId,
      isVisible,
      toggleInput,
      removeFeedbackForField,
    }: {
      blockId: string
      isVisible: boolean
      toggleInput: (id: string, type: string) => void
      removeFeedbackForField: () => void
    }) => (
      <div data-testid={`time-input-${blockId}`}>
        {isVisible ? 'Time Input Visible' : 'Time Input Button'}
        <button onClick={() => toggleInput(blockId, 'time')}>
          Toggle Time
        </button>
        <button
          data-testid="remove-time-feedback"
          onClick={() => removeFeedbackForField()}
        >
          Remove Time Feedback
        </button>
      </div>
    )
  ),
}))

jest.mock('@react-google-maps/api', () => ({
  useLoadScript: jest.fn().mockReturnValue({ isLoaded: true }),
}))

jest.mock('@/modules/ItineraryMakerModule/module-elements/PriceInput', () => ({
  PriceInput: jest.fn(
    ({
      blockId,
      isVisible,
      toggleInput,
      removeFeedbackForField,
    }: {
      blockId: string
      isVisible: boolean
      toggleInput: (id: string, type: string) => void
      removeFeedbackForField: () => void
    }) => (
      <div data-testid={`price-input-${blockId}`}>
        {isVisible ? 'Price Input Visible' : 'Price Input Button'}
        <button onClick={() => toggleInput(blockId, 'price')}>
          Toggle Price
        </button>
        <button
          data-testid="remove-price-feedback"
          onClick={() => removeFeedbackForField()}
        >
          Remove Price Feedback
        </button>
      </div>
    )
  ),
}))

jest.mock('@/modules/ItineraryMakerModule/module-elements/RouteInfo', () => ({
  RouteInfo: jest.fn(
    ({
      distance,
      duration,
      transportMode,
      onTransportModeChange,
    }: {
      distance: number
      duration: number
      transportMode?: TransportMode
      onTransportModeChange?: (mode: TransportMode) => Promise<boolean>
    }) => (
      <div data-testid="route-info">
        <span data-testid="route-distance">{distance}</span>
        <span data-testid="route-duration">{duration}</span>
        <span data-testid="route-mode">{transportMode}</span>
        {onTransportModeChange && (
          <button
            data-testid="mode-walk"
            onClick={() => onTransportModeChange(TransportMode.WALK)}
          >
            Change Mode
          </button>
        )}
      </div>
    )
  ),
}))

// Mock the UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({
    children,
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div className={className} data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardContent: ({
    children,
    className,
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div className={className} data-testid="card-content">
      {children}
    </div>
  ),
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({
    placeholder,
    value,
    onChange,
    className,
  }: {
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
  }) => (
    <input
      placeholder={placeholder}
      value={value || ''}
      onChange={onChange}
      className={className}
      data-testid={
        placeholder ? `input-${placeholder.substring(0, 10)}` : 'input'
      }
    />
  ),
}))

jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({
    placeholder,
    value,
    onChange,
    className,
  }: {
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    className: string
  }) => (
    <textarea
      placeholder={placeholder}
      value={value || ''}
      onChange={onChange}
      className={className}
      data-testid={`textarea-${placeholder}`}
    />
  ),
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    size,
  }: {
    children: React.ReactNode
    onClick: () => void
    variant: string
    size: string
  }) => (
    <button onClick={onClick} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
}))

jest.mock('lucide-react', () => ({
  X: () => 'X',
  GripVertical: () => 'GripVertical',
  Car: () => 'Car',
  Navigation: () => 'Navigation',
  Bike: () => 'Bike',
  Bus: () => 'Bus',
}))

describe('ItineraryBlock Component', () => {
  const mockIsInputVisible = jest.fn()
  const mockToggleInput = jest.fn()
  const mockUpdateBlock = jest.fn()
  const mockRemoveBlock = jest.fn()
  const mockSetPositionToView = jest.fn()
  const mockRemoveFeedbackForField = jest.fn()

  const blockId = 'test-block-123'
  const blockIndex = 0
  const sectionNumber = 1

  beforeEach(() => {
    jest.clearAllMocks()
    mockIsInputVisible.mockReturnValue(false)
  })

  const createLocationBlock = (): Block => ({
    id: blockId,
    blockType: 'LOCATION',
    title: 'Test Location',
    description: 'This is a test location',
    startTime: '2023-01-01T09:00:00Z',
    endTime: '2023-01-01T10:00:00Z',
    price: 50000,
    location: '-8.65,115.2167',
  })

  const createNoteBlock = (): Block => ({
    id: blockId,
    title: '',
    blockType: 'NOTE',
    description: 'This is a test note',
  })

  test('renders a location block correctly', () => {
    const locationBlock = createLocationBlock()

    render(
      <ItineraryBlock
        block={locationBlock}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={null}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeBlock={mockRemoveBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={false}
        setPositionToView={mockSetPositionToView}
      />
    )

    // Check if title input is rendered
    expect(screen.getByDisplayValue('Test Location')).toBeInTheDocument()

    // Check if all the input components are rendered
    expect(screen.getByTestId(`time-input-${blockId}`)).toBeInTheDocument()
    expect(screen.getByTestId(`price-input-${blockId}`)).toBeInTheDocument()

    // Check if description input is rendered
    expect(
      screen.getByDisplayValue('This is a test location')
    ).toBeInTheDocument()
  })

  test('renders a note block correctly', () => {
    const noteBlock = createNoteBlock()

    render(
      <ItineraryBlock
        block={noteBlock}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={null}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeBlock={mockRemoveBlock}
        setPositionToView={mockSetPositionToView}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={false}
      />
    )

    // Check if textarea is rendered for note block
    expect(screen.getByTestId('textarea-Masukkan Catatan')).toBeInTheDocument()
    expect(screen.getByDisplayValue('This is a test note')).toBeInTheDocument()

    // Verify that time and price are NOT rendered for note blocks
    expect(
      screen.queryByTestId(`time-input-${blockId}`)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId(`price-input-${blockId}`)
    ).not.toBeInTheDocument()
  })

  test('renders RouteInfo when showRoute is true and routeInfo exists', () => {
    const locationBlock = createLocationBlock()
    const routeInfo = {
      sourceBlockId: 'source-123',
      destinationBlockId: 'dest-123',
      distance: 10,
      duration: 30,
      polyline: 'test',
      transportMode: TransportMode.DRIVE,
    }

    render(
      <ItineraryBlock
        block={locationBlock}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={null}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeBlock={mockRemoveBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={true}
        routeInfo={routeInfo}
        setPositionToView={mockSetPositionToView}
      />
    )

    // Route info should be rendered with the correct data
    expect(screen.getByTestId('route-info')).toBeInTheDocument()
    expect(screen.getByTestId('route-distance').textContent).toBe('10')
    expect(screen.getByTestId('route-duration').textContent).toBe('30')
    expect(screen.getByTestId('route-mode').textContent).toBe(
      TransportMode.DRIVE
    )
  })

  test('does not render RouteInfo when showRoute is false', () => {
    const locationBlock = createLocationBlock()
    const routeInfo = {
      sourceBlockId: 'source-123',
      destinationBlockId: 'dest-123',
      distance: 10,
      duration: 30,
      polyline: 'test',
      transportMode: TransportMode.DRIVE,
    }

    render(
      <ItineraryBlock
        block={locationBlock}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={null}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeBlock={mockRemoveBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={false}
        routeInfo={routeInfo}
        setPositionToView={mockSetPositionToView}
      />
    )

    expect(screen.queryByTestId('route-info')).not.toBeInTheDocument()
  })

  test('handles successful transport mode change', async () => {
    const locationBlock = createLocationBlock()
    const routeInfo = {
      sourceBlockId: 'source-123',
      destinationBlockId: 'dest-123',
      distance: 10,
      duration: 30,
      polyline: 'test',
      transportMode: TransportMode.DRIVE,
    }

    // Mock to return success (true)
    const mockOnTransportModeChange = jest.fn().mockResolvedValue(true)

    render(
      <ItineraryBlock
        block={locationBlock}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={null}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeBlock={mockRemoveBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={true}
        routeInfo={routeInfo}
        onTransportModeChange={mockOnTransportModeChange}
        setPositionToView={mockSetPositionToView}
      />
    )

    // Click the button to change transport mode to WALK
    fireEvent.click(screen.getByTestId('mode-walk'))

    // Check that the loading toast was shown
    expect(toast.loading).toHaveBeenCalled()

    // Wait for the async function to complete
    await waitFor(() => {
      // Success callback should have been called
      expect(mockOnTransportModeChange).toHaveBeenCalledWith(
        locationBlock.id,
        TransportMode.WALK
      )
      // Success toast should be shown
      expect(toast.success).toHaveBeenCalledWith(
        'Rute berhasil diperbarui',
        expect.objectContaining({ id: 'route-calc' })
      )
    })
  })

  test('handles failed transport mode change', async () => {
    const locationBlock = createLocationBlock()
    const routeInfo = {
      sourceBlockId: 'source-123',
      destinationBlockId: 'dest-123',
      distance: 10,
      duration: 30,
      polyline: 'test',
      transportMode: TransportMode.DRIVE,
    }

    const mockOnTransportModeChange = jest.fn().mockResolvedValue(false)

    render(
      <ItineraryBlock
        block={locationBlock}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={null}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeBlock={mockRemoveBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={true}
        routeInfo={routeInfo}
        onTransportModeChange={mockOnTransportModeChange}
        setPositionToView={mockSetPositionToView}
      />
    )

    fireEvent.click(screen.getByTestId('mode-walk'))
    expect(toast.loading).toHaveBeenCalled()

    await waitFor(() => {
      expect(mockOnTransportModeChange).toHaveBeenCalledWith(
        locationBlock.id,
        TransportMode.WALK
      )
      expect(toast.success).not.toHaveBeenCalled()
    })
  })

  test('handles errors during transport mode change', async () => {
    const locationBlock = createLocationBlock()
    const routeInfo = {
      sourceBlockId: 'source-123',
      destinationBlockId: 'dest-123',
      distance: 10,
      duration: 30,
      polyline: 'test',
      transportMode: TransportMode.DRIVE,
    }

    const mockOnTransportModeChange = jest
      .fn()
      .mockRejectedValue(new Error('Test error'))

    render(
      <ItineraryBlock
        block={locationBlock}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={null}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeBlock={mockRemoveBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={true}
        routeInfo={routeInfo}
        onTransportModeChange={mockOnTransportModeChange}
        setPositionToView={mockSetPositionToView}
      />
    )

    fireEvent.click(screen.getByTestId('mode-walk'))

    await waitFor(() => {
      expect(mockOnTransportModeChange).toHaveBeenCalledWith(
        locationBlock.id,
        TransportMode.WALK
      )
      expect(toast.error).toHaveBeenCalledWith(
        'Terjadi kesalahan saat memperbarui rute',
        expect.objectContaining({ id: 'route-calc' })
      )
    })
  })

  test('handles case when onTransportModeChange is undefined', async () => {
    const locationBlock = createLocationBlock()
    const routeInfo = {
      sourceBlockId: 'source-123',
      destinationBlockId: 'dest-123',
      distance: 10,
      duration: 30,
      polyline: 'test',
      transportMode: TransportMode.DRIVE,
    }

    render(
      <ItineraryBlock
        block={locationBlock}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={null}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeBlock={mockRemoveBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={true}
        routeInfo={routeInfo}
        setPositionToView={mockSetPositionToView}
        // Intentionally not providing onTransportModeChange
      />
    )

    fireEvent.click(screen.getByTestId('mode-walk'))

    await waitFor(() => {
      expect(toast.loading).toHaveBeenCalled()
      expect(toast.success).not.toHaveBeenCalled()
    })
  })

  test('updates block description when description input changes', () => {
    const locationBlock = createLocationBlock()

    render(
      <ItineraryBlock
        block={locationBlock}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={null}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        setPositionToView={mockSetPositionToView}
        removeBlock={mockRemoveBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={false}
      />
    )

    const descriptionInput = screen.getByDisplayValue('This is a test location')
    fireEvent.change(descriptionInput, {
      target: { value: 'Updated description' },
    })

    expect(mockUpdateBlock).toHaveBeenCalledWith(
      blockId,
      'description',
      'Updated description'
    )
  })

  test('updates note description when textarea changes', () => {
    const noteBlock = createNoteBlock()

    render(
      <ItineraryBlock
        block={noteBlock}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={null}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        setPositionToView={mockSetPositionToView}
        removeBlock={mockRemoveBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={false}
      />
    )

    const textarea = screen.getByTestId('textarea-Masukkan Catatan')
    fireEvent.change(textarea, { target: { value: 'Updated note content' } })

    expect(mockUpdateBlock).toHaveBeenCalledWith(
      blockId,
      'description',
      'Updated note content'
    )
  })

  test('calls removeBlock when remove button is clicked', () => {
    const locationBlock = createLocationBlock()

    render(
      <ItineraryBlock
        block={locationBlock}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={null}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        setPositionToView={mockSetPositionToView}
        removeBlock={mockRemoveBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={false}
      />
    )

    const removeButton = screen.getByText('X').closest('button')
    if (removeButton) {
      fireEvent.click(removeButton)
    }

    expect(mockRemoveBlock).toHaveBeenCalledWith(blockId)
  })

  test('handles undefined description', () => {
    const blockWithoutDescription = {
      ...createLocationBlock(),
      description: undefined,
    }

    render(
      <ItineraryBlock
        block={blockWithoutDescription}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={null}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        setPositionToView={mockSetPositionToView}
        removeBlock={mockRemoveBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={false}
      />
    )

    const descriptionInput = screen.getByTestId('input-Tambahkan')
    expect(descriptionInput).toHaveValue('')
  })

  test('applies border-red-500 when there is a timeWarning for the block', () => {
    const locationBlock = createLocationBlock()
    const timeWarning = { blockId: blockId, message: 'Time conflict' }

    render(
      <ItineraryBlock
        block={locationBlock}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={timeWarning}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        setPositionToView={mockSetPositionToView}
        removeBlock={mockRemoveBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={false}
      />
    )

    expect(screen.getByTestId('draggable-props')).toHaveClass('border-red-500')
  })

  test('does not apply border-red-500 when timeWarning is for different block', () => {
    const locationBlock = createLocationBlock()
    const timeWarning = { blockId: 'other-block', message: 'Time conflict' }

    render(
      <ItineraryBlock
        block={locationBlock}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={timeWarning}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        setPositionToView={mockSetPositionToView}
        removeBlock={mockRemoveBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={false}
      />
    )

    expect(screen.getByTestId('draggable-props')).not.toHaveClass(
      'border-red-500'
    )
  })

  test('calls removeFeedbackForField for time input when feedback removal button is clicked', () => {
    const locationBlock = createLocationBlock()

    render(
      <ItineraryBlock
        block={locationBlock}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={null}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeBlock={mockRemoveBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={false}
        setPositionToView={mockSetPositionToView}
      />
    )

    // Find and click the remove feedback button in TimeInput component
    const removeFeedbackButton = screen.getByTestId('remove-time-feedback')
    fireEvent.click(removeFeedbackButton)

    // Verify that removeFeedbackForField was called with the correct parameters
    expect(mockRemoveFeedbackForField).toHaveBeenCalledWith(
      sectionNumber,
      blockId,
      'time'
    )
  })

  test('calls removeFeedbackForField for price input when feedback removal button is clicked', () => {
    const locationBlock = createLocationBlock()

    render(
      <ItineraryBlock
        block={locationBlock}
        blockIndex={blockIndex}
        sectionNumber={sectionNumber}
        timeWarning={null}
        isInputVisible={mockIsInputVisible}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeBlock={mockRemoveBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        feedbackItems={[]}
        showRoute={false}
        setPositionToView={mockSetPositionToView}
      />
    )

    // Find and click the remove feedback button in PriceInput component
    const removeFeedbackButton = screen.getByTestId('remove-price-feedback')
    fireEvent.click(removeFeedbackButton)

    // Verify that removeFeedbackForField was called with the correct parameters
    expect(mockRemoveFeedbackForField).toHaveBeenCalledWith(
      sectionNumber,
      blockId,
      'price'
    )
  })
})
