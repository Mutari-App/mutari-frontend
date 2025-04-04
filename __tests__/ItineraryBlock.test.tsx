import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ItineraryBlock } from '@/modules/ItineraryMakerModule/module-elements/ItineraryBlock'
import '@testing-library/jest-dom'
import { useLoadScript } from '@react-google-maps/api'
import { type Block } from '@/modules/ItineraryMakerModule/interface'

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
    }: {
      blockId: string
      isVisible: boolean
      toggleInput: (id: string, type: string) => void
    }) => (
      <div data-testid={`time-input-${blockId}`}>
        {isVisible ? 'Time Input Visible' : 'Time Input Button'}
        <button onClick={() => toggleInput(blockId, 'time')}>
          Toggle Time
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
    }: {
      blockId: string
      isVisible: boolean
      toggleInput: (id: string, type: string) => void
    }) => (
      <div data-testid={`price-input-${blockId}`}>
        {isVisible ? 'Price Input Visible' : 'Price Input Button'}
        <button onClick={() => toggleInput(blockId, 'price')}>
          Toggle Price
        </button>
      </div>
    )
  ),
}))

jest.mock(
  '@/modules/ItineraryMakerModule/module-elements/CoordinateInput',
  () => ({
    CoordinateInput: jest.fn(
      ({
        blockId,
        isVisible,
        toggleInput,
      }: {
        blockId: string
        isVisible: boolean
        toggleInput: (id: string, type: string) => void
      }) => (
        <div data-testid={`coordinate-input-${blockId}`}>
          {isVisible ? 'Coordinate Input Visible' : 'Coordinate Input Button'}
          <button onClick={() => toggleInput(blockId, 'location')}>
            Toggle Coordinate
          </button>
        </div>
      )
    ),
  })
)

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
}))

describe('ItineraryBlock Component', () => {
  const mockIsInputVisible = jest.fn()
  const mockToggleInput = jest.fn()
  const mockUpdateBlock = jest.fn()
  const mockRemoveBlock = jest.fn()

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
      />
    )

    // Check if title input is rendered
    expect(screen.getByDisplayValue('Test Location')).toBeInTheDocument()

    // Check if all the input components are rendered
    expect(screen.getByTestId(`time-input-${blockId}`)).toBeInTheDocument()
    expect(screen.getByTestId(`price-input-${blockId}`)).toBeInTheDocument()
    expect(
      screen.getByTestId(`coordinate-input-${blockId}`)
    ).toBeInTheDocument()

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
      />
    )

    // Check if textarea is rendered for note block
    expect(screen.getByTestId('textarea-Masukkan Catatan')).toBeInTheDocument()
    expect(screen.getByDisplayValue('This is a test note')).toBeInTheDocument()

    // Verify that time, price, and coordinate inputs are NOT rendered for note blocks
    expect(
      screen.queryByTestId(`time-input-${blockId}`)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId(`price-input-${blockId}`)
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId(`coordinate-input-${blockId}`)
    ).not.toBeInTheDocument()
  })

  // test('updates block title when title input changes', () => {
  //   const locationBlock = createLocationBlock()

  //   render(
  //     <ItineraryBlock
  //       block={locationBlock}
  //       blockIndex={blockIndex}
  //       sectionNumber={sectionNumber}
  //       timeWarning={null}
  //       isInputVisible={mockIsInputVisible}
  //       toggleInput={mockToggleInput}
  //       updateBlock={mockUpdateBlock}
  //       removeBlock={mockRemoveBlock}
  //     />
  //   )

  //   const titleInput = screen.getByDisplayValue('Test Location')
  //   fireEvent.change(titleInput, {
  //     target: { value: 'Updated Location Title' },
  //   })

  //   expect(mockUpdateBlock).toHaveBeenCalledWith(
  //     blockId,
  //     'title',
  //     'Updated Location Title'
  //   )
  // })

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
        removeBlock={mockRemoveBlock}
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
        removeBlock={mockRemoveBlock}
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
        removeBlock={mockRemoveBlock}
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
        removeBlock={mockRemoveBlock}
      />
    )

    const descriptionInput = screen.getByTestId('input-Tambahkan')
    expect(descriptionInput).toHaveValue('')
  })
})
