import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AutocompleteInput from '@/modules/ItineraryMakerModule/module-elements/AutocompleteInput'
import usePlacesAutocomplete from 'use-places-autocomplete'
import userEvent from '@testing-library/user-event'

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

describe('AutocompleteInput Component', () => {
  const updateBlock = jest.fn()
  const toggleInput = jest.fn()
  const mockSetPositionToView = jest.fn()
  const blockId = 'test-block'
  const title = 'Initial Title'

  const originalEnv = process.env

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'dummy-key',
    }
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
})
