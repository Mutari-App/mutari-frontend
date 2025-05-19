import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import SearchBar from '@/components/SearchBar'
import { customFetch } from '@/utils/newCustomFetch'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">SearchIcon</div>,
  X: () => <div data-testid="x-icon">XIcon</div>,
}))

// Mock UI components
jest.mock('@/components/ui/input', () => ({
  Input: ({
    type,
    placeholder,
    value,
    onChange,
    onFocus,
    className,
    ref,
  }: {
    type: string
    placeholder: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onFocus: () => void
    className: string
    ref: React.Ref<HTMLInputElement>
  }) => (
    <input
      data-testid="search-input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      className={className}
      ref={ref}
    />
  ),
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({
    type,
    variant,
    size,
    onClick,
    className,
    children,
  }: React.PropsWithChildren<{
    type?: 'button' | 'submit'
    variant?: string
    size?: string
    onClick?: () => void
    className?: string
  }>) => (
    <button
      data-testid={onClick ? 'clear-button' : 'search-button'}
      type={type}
      data-variant={variant}
      data-size={size}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  ),
}))

// Mock the SearchHistoryDropdown component
jest.mock('@/components/SearchHistoryDropdown', () => ({
  __esModule: true,
  default: ({
    searchHistory,
    suggestions,
    onSelectItem,
    onClearHistoryItem,
    onClearAllHistory,
    className,
  }: {
    searchHistory: string[]
    suggestions: string[]
    onSelectItem: (query: string) => void
    onClearHistoryItem: (query: string) => void
    onClearAllHistory: () => void
    className?: string
  }) => (
    <div data-testid="search-history-dropdown" className={className}>
      {searchHistory.map((item) => (
        <div
          key={`history-${item}`}
          data-testid="history-item"
          onClick={() => onSelectItem(item)}
        >
          {item}
          <button
            data-testid={`clear-history-${item}`}
            onClick={(e) => {
              e.stopPropagation()
              onClearHistoryItem(item)
            }}
          >
            Clear
          </button>
        </div>
      ))}
      {suggestions.map((item) => (
        <div
          key={`suggestion-${item}`}
          data-testid="suggestion-item"
          onClick={() => onSelectItem(item)}
        >
          {item}
        </div>
      ))}
      <button data-testid="clear-all-history" onClick={onClearAllHistory}>
        Clear All
      </button>
    </div>
  ),
}))

// Mock the customFetch utility
jest.mock('@/utils/newCustomFetch', () => ({
  customFetch: jest.fn().mockImplementation((url) => {
    // Default success response
    if (typeof url === 'string' && url.includes('error')) {
      // Simulate a fetch error when 'error' is in the URL
      return Promise.reject(new Error('Network error'))
    }
    return Promise.resolve({ suggestions: ['Bali Trip', 'Tokyo Adventure'] })
  }),
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()
  })

  test('renders correctly with initial value', () => {
    render(
      <SearchBar
        initialValue="Initial Query"
        onSearch={mockOnSearch}
        className="custom-class"
        searchType="tour"
      />
    )

    const searchInput = screen.getByTestId('search-input')
    expect(searchInput).toHaveValue('Initial Query')
    expect(searchInput).toBeInTheDocument()

    // Check if the search button is rendered
    expect(screen.getByTestId('search-button')).toBeInTheDocument()

    // Check if the clear button is rendered (since we have an initial value)
    expect(screen.getByTestId('clear-button')).toBeInTheDocument()
  })

  test('updates input value when typing', () => {
    render(<SearchBar initialValue="" onSearch={mockOnSearch} />)

    const searchInput = screen.getByTestId('search-input')
    fireEvent.change(searchInput, { target: { value: 'Test Query' } })

    expect(searchInput).toHaveValue('Test Query')
  })

  test('calls onSearch when form is submitted', () => {
    render(<SearchBar initialValue="" onSearch={mockOnSearch} />)

    const searchInput = screen.getByTestId('search-input')
    fireEvent.change(searchInput, { target: { value: 'New Search' } })

    // Submit the form
    const form = searchInput.closest('form')
    if (form) {
      fireEvent.submit(form)
    }

    // Check if onSearch was called with the input value
    expect(mockOnSearch).toHaveBeenCalledWith('New Search')

    // Check if it was added to localStorage
    const history = JSON.parse(
      localStorage.getItem('itinerary-search-history') ?? '[]'
    ) as string[]
    expect(history).toContain('New Search')
  })

  test('clears input when clear button is clicked', () => {
    render(<SearchBar initialValue="Test Query" onSearch={mockOnSearch} />)

    const searchInput = screen.getByTestId('search-input')
    expect(searchInput).toHaveValue('Test Query')

    // Click the clear button
    const clearButton = screen.getByTestId('clear-button')
    fireEvent.click(clearButton)

    // Input should be cleared
    expect(searchInput).toHaveValue('')
  })

  test('shows search history dropdown when input is focused', async () => {
    // Pre-set some search history in localStorage
    localStorage.setItem(
      'itinerary-search-history',
      JSON.stringify(['Past Search 1', 'Past Search 2'])
    )

    render(<SearchBar initialValue="" onSearch={mockOnSearch} />)

    const searchInput = screen.getByTestId('search-input')

    // Focus the input
    await act(async () => {
      fireEvent.focus(searchInput)
    })

    // Check if dropdown is rendered
    await waitFor(() => {
      expect(screen.getByTestId('search-history-dropdown')).toBeInTheDocument()
    })

    // Check if history items are rendered
    expect(screen.getAllByTestId('history-item')).toHaveLength(2)
  })

  test('fetches suggestions when typing at least 2 characters', async () => {
    render(<SearchBar initialValue="" onSearch={mockOnSearch} />)

    const searchInput = screen.getByTestId('search-input')

    // Focus the input
    fireEvent.focus(searchInput)

    // Type 2 characters
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Ba' } })
    })

    // Wait for the debounce timeout
    await waitFor(
      () => {
        expect(customFetch).toHaveBeenCalledWith(
          '/itineraries/suggestions?q=Ba',
          { method: 'GET' }
        )
      },
      { timeout: 350 }
    ) // Slightly longer than the 300ms delay

    // Check if suggestions are rendered
    await waitFor(() => {
      expect(screen.getAllByTestId('suggestion-item')).toHaveLength(2)
    })
  })

  test('selects an item from history and performs search', async () => {
    localStorage.setItem(
      'itinerary-search-history',
      JSON.stringify(['Past Search 1'])
    )

    render(<SearchBar initialValue="" onSearch={mockOnSearch} />)

    const searchInput = screen.getByTestId('search-input')

    // Focus the input to show the dropdown
    await act(async () => {
      fireEvent.focus(searchInput)
    })

    // Click on a history item
    await waitFor(() => {
      const historyItem = screen.getByTestId('history-item')
      fireEvent.click(historyItem)
    })

    // Check if onSearch was called with the history item
    expect(mockOnSearch).toHaveBeenCalledWith('Past Search 1')

    // Input value should be updated
    expect(searchInput).toHaveValue('Past Search 1')
  })

  test('clears a specific history item', async () => {
    localStorage.setItem(
      'itinerary-search-history',
      JSON.stringify(['Item 1', 'Item 2'])
    )

    render(<SearchBar initialValue="" onSearch={mockOnSearch} />)

    // Focus the input to show the dropdown
    const searchInput = screen.getByTestId('search-input')
    await act(async () => {
      fireEvent.focus(searchInput)
    })

    // Click the clear button for the first item
    await waitFor(() => {
      const clearButton = screen.getByTestId('clear-history-Item 1')
      fireEvent.click(clearButton)
    })

    // Check if the item was removed from localStorage
    const history = JSON.parse(
      localStorage.getItem('itinerary-search-history') ?? '[]'
    ) as string[]
    expect(history).not.toContain('Item 1')
    expect(history).toContain('Item 2')
  })

  test('clears all history items', async () => {
    localStorage.setItem(
      'itinerary-search-history',
      JSON.stringify(['Item 1', 'Item 2'])
    )

    render(<SearchBar initialValue="" onSearch={mockOnSearch} />)

    // Focus the input to show the dropdown
    const searchInput = screen.getByTestId('search-input')
    await act(async () => {
      fireEvent.focus(searchInput)
    })

    // Click the clear all button
    await waitFor(() => {
      const clearAllButton = screen.getByTestId('clear-all-history')
      fireEvent.click(clearAllButton)
    })

    // Check if all items were removed from localStorage
    const history = localStorage.getItem('itinerary-search-history')
    expect(history).toBeNull()
  })

  test('limits search history to 5 items', async () => {
    // Pre-set 5 items in history
    localStorage.setItem(
      'itinerary-search-history',
      JSON.stringify(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'])
    )

    render(<SearchBar initialValue="" onSearch={mockOnSearch} />)

    const searchInput = screen.getByTestId('search-input')
    fireEvent.change(searchInput, { target: { value: 'New Item' } })

    // Submit the form to add the new item
    const form = searchInput.closest('form')
    if (form) {
      fireEvent.submit(form)
    }

    // Check if history is limited to 5 items and the oldest item is removed
    const history = JSON.parse(
      localStorage.getItem('itinerary-search-history') ?? '[]'
    ) as string[]
    expect(history).toHaveLength(5)
    expect(history).toContain('New Item')
    expect(history).not.toContain('Item 5') // The oldest item should be removed
  })

  test('does not add empty queries to history', () => {
    render(<SearchBar initialValue="" onSearch={mockOnSearch} />)

    // Submit the form with empty input
    const form = screen.getByTestId('search-input').closest('form')
    if (form) {
      fireEvent.submit(form)
    }

    // onSearch should not be called
    expect(mockOnSearch).not.toHaveBeenCalled()

    // History should be empty
    const history = localStorage.getItem('itinerary-search-history')
    expect(history).toBeNull()
  })

  test('updates input when initialValue prop changes', () => {
    const { rerender } = render(
      <SearchBar initialValue="Initial" onSearch={mockOnSearch} />
    )

    const searchInput = screen.getByTestId('search-input')
    expect(searchInput).toHaveValue('Initial')

    // Change the initialValue prop
    rerender(<SearchBar initialValue="Updated" onSearch={mockOnSearch} />)

    // Input value should update
    expect(searchInput).toHaveValue('Updated')
  })

  test('closes dropdown when clicking outside', async () => {
    localStorage.setItem(
      'itinerary-search-history',
      JSON.stringify(['Past Search 1'])
    )

    render(<SearchBar initialValue="" onSearch={mockOnSearch} />)

    // Open the dropdown by focusing the input
    const searchInput = screen.getByTestId('search-input')
    await act(async () => {
      fireEvent.focus(searchInput)
    })

    // Verify dropdown is shown
    await waitFor(() => {
      expect(screen.getByTestId('search-history-dropdown')).toBeInTheDocument()
    })

    // Simulate a click outside both the input and dropdown
    await act(async () => {
      // Create a mousedown event on the document
      const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      })
      document.dispatchEvent(mouseEvent)
    })

    // Dropdown should be closed (no longer in the document)
    await waitFor(() => {
      expect(
        screen.queryByTestId('search-history-dropdown')
      ).not.toBeInTheDocument()
    })
  })

  test('handles errors when fetching suggestions', async () => {
    // Spy on console.error to verify it's called
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      'ini isi'
    })

    render(<SearchBar initialValue="" onSearch={mockOnSearch} />)

    const searchInput = screen.getByTestId('search-input')

    // Focus the input
    fireEvent.focus(searchInput)

    // Type something that will trigger an error (based on our mock implementation)
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'error' } })
    })

    // Wait for the customFetch to be called
    await waitFor(() => {
      expect(customFetch).toHaveBeenCalledWith(
        '/itineraries/suggestions?q=error',
        { method: 'GET' }
      )
    })

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to fetch suggestions:',
      expect.any(Error)
    )

    // Cleanup
    consoleSpy.mockRestore()
  })

  test('does not fetch suggestions when input length is less than 2', async () => {
    render(<SearchBar initialValue="" onSearch={mockOnSearch} />)

    const searchInput = screen.getByTestId('search-input')

    // Focus the input
    fireEvent.focus(searchInput)

    // Type a single character
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'a' } })
    })

    // Wait a bit to ensure no fetch is made
    await new Promise((r) => setTimeout(r, 350))

    // customFetch should not have been called
    expect(customFetch).not.toHaveBeenCalled()
  })

  test('clears suggestions when input is cleared', async () => {
    render(<SearchBar initialValue="" onSearch={mockOnSearch} />)

    const searchInput = screen.getByTestId('search-input')

    // Focus and type to get suggestions
    fireEvent.focus(searchInput)
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Ba' } })
    })

    // Wait for suggestions to be fetched
    await waitFor(() => {
      expect(customFetch).toHaveBeenCalled()
    })

    // Then clear the input
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '' } })
    })

    // Click the clear button (optional, depends on your component's behavior)
    const clearButton = screen.queryByTestId('clear-button')
    if (clearButton) {
      fireEvent.click(clearButton)
    }

    // If there is a dropdown, it should not have any suggestion items
    const dropdown = screen.queryByTestId('search-history-dropdown')
    if (dropdown) {
      expect(screen.queryAllByTestId('suggestion-item')).toHaveLength(0)
    }
  })
})
