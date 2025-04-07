import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AutocompleteInput from '@/modules/ItineraryMakerModule/module-elements/AutocompleteInput'
import { useLoadScript } from '@react-google-maps/api'
import usePlacesAutocomplete from 'use-places-autocomplete'

jest.mock('@react-google-maps/api', () => ({
  useLoadScript: jest.fn(),
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

  beforeEach(() => {
    (useLoadScript as jest.Mock).mockReturnValue({ isLoaded: true })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders loading state when Google Maps API is not loaded', () => {
    ;(useLoadScript as jest.Mock).mockReturnValueOnce({ isLoaded: false })
    render(
      <AutocompleteInput
        updateBlock={updateBlock}
        setPositionToView={mockSetPositionToView}
        toggleInput={toggleInput}
        blockId={blockId}
        title={title}
      />
    )
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
  })

  test('renders input field when Google Maps API is loaded', () => {
    ;(useLoadScript as jest.Mock).mockReturnValueOnce({ isLoaded: true })
    render(
      <AutocompleteInput
        updateBlock={updateBlock}
        setPositionToView={mockSetPositionToView}
        toggleInput={toggleInput}
        blockId={blockId}
        title={title}
      />
    )
    expect(screen.getByPlaceholderText(/Search Location/i)).toBeInTheDocument()
  })

  test('updates input value on change', async () => {
    const setValueMock = jest.fn()
    ;(useLoadScript as jest.Mock).mockReturnValueOnce({ isLoaded: true })
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
        toggleInput={toggleInput}
        blockId={blockId}
        title={title}
      />
    )

    const input = screen.getByPlaceholderText(/Search Location/i)
    fireEvent.change(input, { target: { value: 'Jakarta' } })
    expect(setValueMock).toHaveBeenCalledWith('Jakarta')
  })

  test('handles selecting a location correctly', async () => {
    ;(useLoadScript as jest.Mock).mockReturnValueOnce({ isLoaded: true })
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
      toggleInput={toggleInput}
      blockId={blockId}
      title={title}
      />
    )

    const input = screen.getByTestId('autocomplete-input');
    fireEvent.change(input, { target: { value: 'Jakarta' } });

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
      expect(toggleInput).toHaveBeenCalledWith(blockId, 'location')
    })
  })
})
