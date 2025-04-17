import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AutocompleteInput from '@/modules/ItineraryMakerModule/module-elements/AutocompleteInput'
import usePlacesAutocomplete from 'use-places-autocomplete'
import useOutsideClick from '@/hooks/useOutsideClick'

// Mock useOutsideClick hook
jest.mock('@/hooks/useOutsideClick', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({
    children,
    onLoad,
  }: {
    children: React.ReactNode
    onLoad?: () => void
  }) => {
    onLoad?.() // call it manually so it's covered
    return <div data-testid="api-provider">{children}</div>
  },
}))

jest.mock('use-places-autocomplete', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    ready: true,
    value: '',
    setValue: jest.fn(),
    suggestions: {
      status: 'OK',
      data: [
        {
          place_id: '123',
          structured_formatting: { main_text: 'Test Place' },
          description: 'Test Place, Indonesia',
        },
      ],
    },
    clearSuggestions: jest.fn(),
  })),
  getGeocode: jest
    .fn()
    .mockResolvedValue([
      { geometry: { location: { lat: () => -6.2, lng: () => 106.8 } } },
    ]),
  getLatLng: jest.fn().mockReturnValue({
    lat: -6.2,
    lng: 106.8,
  }),
}))

jest.mock('lucide-react', () => ({
  Edit2: () => <div data-testid="edit-icon">Edit2</div>,
}))

describe('AutocompleteInput Component', () => {
  const updateBlock = jest.fn()
  const mockSetPositionToView = jest.fn()
  const blockId = 'test-block'
  const title = 'Initial Title'

  const originalEnv = process.env

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'dummy-key',
    }
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders input field when Google Maps API is loaded', () => {
    render(
      <AutocompleteInput
        updateBlock={updateBlock}
        setPositionToView={mockSetPositionToView}
        blockId={blockId}
        title={title}
      />
    )
    expect(screen.getByPlaceholderText(/Search Location/i)).toBeInTheDocument()
  })

  test('updates input value on change', async () => {
    const setValueMock = jest.fn()
    ;(usePlacesAutocomplete as jest.Mock).mockReturnValue({
      ready: true,
      value: '',
      setValue: setValueMock,
      suggestions: { status: 'OK', data: [] },
      clearSuggestions: jest.fn(),
    })

    render(
      <AutocompleteInput
        updateBlock={updateBlock}
        setPositionToView={mockSetPositionToView}
        blockId={blockId}
        title={title}
      />
    )

    const input = screen.getByPlaceholderText(/Search Location/i)
    fireEvent.change(input, { target: { value: 'Jakarta' } })
    expect(setValueMock).toHaveBeenCalledWith('Jakarta')
  })

  test('handles selecting a location correctly', async () => {
    ;(usePlacesAutocomplete as jest.Mock).mockReturnValue({
      ready: true,
      value: '',
      setValue: jest.fn(),
      suggestions: {
        status: 'OK',
        data: [
          {
            place_id: '123',
            structured_formatting: { main_text: 'Test Place' },
            description: 'Test Place, Indonesia',
          },
        ],
      },
      clearSuggestions: jest.fn(),
    })

    render(
      <AutocompleteInput
        updateBlock={updateBlock}
        setPositionToView={mockSetPositionToView}
        blockId={blockId}
        title={title}
      />
    )

    const input = screen.getByTestId('autocomplete-input')
    fireEvent.change(input, { target: { value: 'Jakarta' } })

    // Pastikan input muncul
    const inputField = screen.getByPlaceholderText(/Search Location/i)
    expect(inputField).toBeInTheDocument()

    // Tunggu sampai suggestion muncul
    await waitFor(() => {
      expect(screen.getByText('Test Place')).toBeInTheDocument()
    })

    // Klik suggestion
    fireEvent.click(screen.getByText('Test Place'))

    // Tunggu hingga handleSelect selesai
    await waitFor(() => {
      expect(updateBlock).toHaveBeenCalledWith(
        blockId,
        'location',
        '-6.2,106.8'
      )
      expect(updateBlock).toHaveBeenCalledWith(blockId, 'title', 'Test Place')
    })
  })

  test('renders input and APIProvider', () => {
    render(
      <AutocompleteInput
        updateBlock={updateBlock}
        setPositionToView={mockSetPositionToView}
        blockId={blockId}
        title={title}
      />
    )
    expect(screen.getByTestId('autocomplete-input')).toBeInTheDocument()
    expect(screen.getByTestId('api-provider')).toBeInTheDocument()
  })

  test('env var fallback to empty string when undefined', () => {
    const originalEnv = process.env
    process.env = { ...originalEnv, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: undefined }

    render(
      <AutocompleteInput
        updateBlock={updateBlock}
        setPositionToView={mockSetPositionToView}
        blockId={blockId}
        title={title}
      />
    )

    // Komponen tetap render tanpa error
    expect(screen.getByTestId('autocomplete-input')).toBeInTheDocument()

    process.env = originalEnv
  })

  test('triggers useOutsideClick handler correctly', async () => {
    let capturedHandler: () => void = () => {
      /* no-op */
    }

    ;(useOutsideClick as jest.Mock).mockImplementation(
      ({ handler }: { handler: () => void }) => {
        capturedHandler = handler
        return null
      }
    )

    const mockValue = 'Test Location'
    ;(usePlacesAutocomplete as jest.Mock).mockReturnValue({
      ready: true,
      value: mockValue,
      setValue: jest.fn(),
      suggestions: { status: 'OK', data: [] },
      clearSuggestions: jest.fn(),
    })

    render(
      <AutocompleteInput
        updateBlock={updateBlock}
        setPositionToView={mockSetPositionToView}
        blockId={blockId}
        title={title}
      />
    )
    capturedHandler()
    expect(updateBlock).toHaveBeenCalledWith(blockId, 'title', mockValue)
  })

  test('handles input focus when value is "Masukkan Lokasi"', () => {
    // Mock select method
    const mockSelect = jest.fn()

    // Setup component with specific value
    ;(usePlacesAutocomplete as jest.Mock).mockReturnValue({
      ready: true,
      value: 'Masukkan Lokasi',
      setValue: jest.fn(),
      suggestions: { status: 'OK', data: [] },
      clearSuggestions: jest.fn(),
    })

    render(
      <AutocompleteInput
        updateBlock={updateBlock}
        setPositionToView={mockSetPositionToView}
        blockId={blockId}
        title="Masukkan Lokasi"
      />
    )

    const input = screen.getByTestId('autocomplete-input')

    // Mock select function on the input element
    Object.defineProperty(input, 'select', {
      value: mockSelect,
    })

    // Trigger focus event
    fireEvent.focus(input)

    // Verify select was called
    expect(mockSelect).toHaveBeenCalled()
  })

  test('handles input focus when value is not "Masukkan Lokasi"', () => {
    // Mock select method
    const mockSelect = jest.fn()

    // Setup component with different value
    ;(usePlacesAutocomplete as jest.Mock).mockReturnValue({
      ready: true,
      value: 'Different Value',
      setValue: jest.fn(),
      suggestions: { status: 'OK', data: [] },
      clearSuggestions: jest.fn(),
    })

    render(
      <AutocompleteInput
        updateBlock={updateBlock}
        setPositionToView={mockSetPositionToView}
        blockId={blockId}
        title="Different Value"
      />
    )

    const input = screen.getByTestId('autocomplete-input')

    // Mock select function on the input element
    Object.defineProperty(input, 'select', {
      value: mockSelect,
    })

    // Trigger focus event
    fireEvent.focus(input)

    // Verify select was not called
    expect(mockSelect).not.toHaveBeenCalled()
  })

  test('shows Edit2 icon on mouse hover and hides on mouse leave', () => {
    render(
      <AutocompleteInput
        updateBlock={updateBlock}
        setPositionToView={mockSetPositionToView}
        blockId={blockId}
        title={title}
      />
    )

    // Initially, edit icon should not be visible
    expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument()

    // Find the container div and trigger mouse enter
    const container =
      screen.getByTestId('autocomplete-input').parentElement?.parentElement
    fireEvent.mouseEnter(container!)

    // Now edit icon should be visible
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument()

    // Trigger mouse leave
    fireEvent.mouseLeave(container!)

    // Edit icon should no longer be visible
    expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument()
  })

  test('initializes with title value when provided', () => {
    const mockSetValue = jest.fn()
    ;(usePlacesAutocomplete as jest.Mock).mockReturnValue({
      ready: true,
      value: '',
      setValue: mockSetValue,
      suggestions: { status: 'OK', data: [] },
      clearSuggestions: jest.fn(),
    })

    const customTitle = 'Custom Location'

    render(
      <AutocompleteInput
        updateBlock={updateBlock}
        setPositionToView={mockSetPositionToView}
        blockId={blockId}
        title={customTitle}
      />
    )

    // Verify setValue was called with the title and false
    expect(mockSetValue).toHaveBeenCalledWith(customTitle, false)
  })
})
