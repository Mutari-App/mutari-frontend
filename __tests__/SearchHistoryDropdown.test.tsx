import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import SearchHistoryDropdown from '@/modules/ItinerarySearchResultsModule/module-elements/SearchHistoryDropdown'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Clock: () => <div data-testid="clock-icon">ClockIcon</div>,
  Search: () => <div data-testid="search-icon">SearchIcon</div>,
  X: () => <div data-testid="x-icon">XIcon</div>,
}))

describe('SearchHistoryDropdown Component', () => {
  const mockOnSelectItem = jest.fn()
  const mockOnClearHistoryItem = jest.fn()
  const mockOnClearAllHistory = jest.fn()

  const searchHistory = ['Past Search 1', 'Past Search 2']
  const suggestions = ['Suggested Search 1', 'Suggested Search 2']

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders correctly with search history and suggestions', () => {
    render(
      <SearchHistoryDropdown
        searchHistory={searchHistory}
        suggestions={suggestions}
        onSelectItem={mockOnSelectItem}
        onClearHistoryItem={mockOnClearHistoryItem}
        onClearAllHistory={mockOnClearAllHistory}
      />
    )

    // Check if search history section is rendered
    expect(screen.getByText('Riwayat Pencarian')).toBeInTheDocument()

    // Check if history items are rendered
    expect(screen.getByText('Past Search 1')).toBeInTheDocument()
    expect(screen.getByText('Past Search 2')).toBeInTheDocument()

    // Check if suggestions section is rendered
    expect(screen.getByText('Saran Pencarian')).toBeInTheDocument()

    // Check if suggestion items are rendered
    expect(screen.getByText('Suggested Search 1')).toBeInTheDocument()
    expect(screen.getByText('Suggested Search 2')).toBeInTheDocument()

    // Check if "Hapus Semua" button is rendered
    expect(screen.getByText('Hapus Semua')).toBeInTheDocument()
  })

  test('renders nothing when both history and suggestions are empty', () => {
    const { container } = render(
      <SearchHistoryDropdown
        searchHistory={[]}
        suggestions={[]}
        onSelectItem={mockOnSelectItem}
        onClearHistoryItem={mockOnClearHistoryItem}
        onClearAllHistory={mockOnClearAllHistory}
      />
    )

    // Container should be empty
    expect(container.firstChild).toBeNull()
  })

  test('renders only suggestions when history is empty', () => {
    render(
      <SearchHistoryDropdown
        searchHistory={[]}
        suggestions={suggestions}
        onSelectItem={mockOnSelectItem}
        onClearHistoryItem={mockOnClearHistoryItem}
        onClearAllHistory={mockOnClearAllHistory}
      />
    )

    // Search history section should not be rendered
    expect(screen.queryByText('Riwayat Pencarian')).not.toBeInTheDocument()

    // Suggestions section should be rendered
    expect(screen.getByText('Saran Pencarian')).toBeInTheDocument()
    expect(screen.getByText('Suggested Search 1')).toBeInTheDocument()
  })

  test('renders only history when suggestions are empty', () => {
    render(
      <SearchHistoryDropdown
        searchHistory={searchHistory}
        suggestions={[]}
        onSelectItem={mockOnSelectItem}
        onClearHistoryItem={mockOnClearHistoryItem}
        onClearAllHistory={mockOnClearAllHistory}
      />
    )

    // Search history section should be rendered
    expect(screen.getByText('Riwayat Pencarian')).toBeInTheDocument()
    expect(screen.getByText('Past Search 1')).toBeInTheDocument()

    // Suggestions section should not be rendered
    expect(screen.queryByText('Saran Pencarian')).not.toBeInTheDocument()
  })

  test('calls onSelectItem when history item is clicked', () => {
    render(
      <SearchHistoryDropdown
        searchHistory={searchHistory}
        suggestions={suggestions}
        onSelectItem={mockOnSelectItem}
        onClearHistoryItem={mockOnClearHistoryItem}
        onClearAllHistory={mockOnClearAllHistory}
      />
    )

    // Click on a history item
    fireEvent.click(screen.getByText('Past Search 1'))

    expect(mockOnSelectItem).toHaveBeenCalledWith('Past Search 1')
  })

  test('calls onSelectItem when suggestion item is clicked', () => {
    render(
      <SearchHistoryDropdown
        searchHistory={searchHistory}
        suggestions={suggestions}
        onSelectItem={mockOnSelectItem}
        onClearHistoryItem={mockOnClearHistoryItem}
        onClearAllHistory={mockOnClearAllHistory}
      />
    )

    // Click on a suggestion item
    fireEvent.click(screen.getByText('Suggested Search 1'))

    expect(mockOnSelectItem).toHaveBeenCalledWith('Suggested Search 1')
  })

  test('calls onClearHistoryItem when clear button for an item is clicked', () => {
    render(
      <SearchHistoryDropdown
        searchHistory={searchHistory}
        suggestions={suggestions}
        onSelectItem={mockOnSelectItem}
        onClearHistoryItem={mockOnClearHistoryItem}
        onClearAllHistory={mockOnClearAllHistory}
      />
    )

    // Find all X buttons
    const clearButtons = screen.getAllByTestId('x-icon')

    // Click the first clear button (for Past Search 1)
    fireEvent.click(clearButtons[0])

    expect(mockOnClearHistoryItem).toHaveBeenCalledWith('Past Search 1')
    // onSelectItem should not be called
    expect(mockOnSelectItem).not.toHaveBeenCalled()
  })

  test('calls onClearAllHistory when "Hapus Semua" button is clicked', () => {
    render(
      <SearchHistoryDropdown
        searchHistory={searchHistory}
        suggestions={suggestions}
        onSelectItem={mockOnSelectItem}
        onClearHistoryItem={mockOnClearHistoryItem}
        onClearAllHistory={mockOnClearAllHistory}
      />
    )

    // Click the "Hapus Semua" button
    fireEvent.click(screen.getByText('Hapus Semua'))

    expect(mockOnClearAllHistory).toHaveBeenCalled()
  })

  test('applies custom className when provided', () => {
    render(
      <SearchHistoryDropdown
        searchHistory={searchHistory}
        suggestions={suggestions}
        onSelectItem={mockOnSelectItem}
        onClearHistoryItem={mockOnClearHistoryItem}
        onClearAllHistory={mockOnClearAllHistory}
        className="custom-class"
      />
    )

    const container = screen.getByText('Riwayat Pencarian').closest('div')
    expect(container?.parentElement?.parentElement).toHaveClass('custom-class')
  })
})
