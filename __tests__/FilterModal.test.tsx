import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import FilterModal from '@/modules/ItinerarySearchResultsModule/module-elements/FilterModal'
import { type ItineraryFilters } from '@/modules/ItinerarySearchResultsModule/interface'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon">XIcon</div>,
  Search: () => <div data-testid="search-icon">SearchIcon</div>,
  ArrowDown: () => <div data-testid="arrow-down">ArrowDown</div>,
  ArrowUp: () => <div data-testid="arrow-up">ArrowUp</div>,
  AlertTriangle: () => <div data-testid="alert-triangle">AlertTriangle</div>,
}))

// Mock UI components
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({
    open,
    onOpenChange,
    children,
  }: React.PropsWithChildren<{
    open: boolean
    onOpenChange: (open: boolean) => void
  }>) => (
    <div
      data-testid="dialog"
      data-open={open}
      data-onchange={String(onOpenChange !== undefined)}
      onClick={() => onOpenChange(false)}
    >
      {children}
    </div>
  ),
  DialogContent: ({
    children,
    className,
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
  DialogHeader: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dialog-title">{children}</div>
  ),
  DialogDescription: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dialog-description">{children}</div>
  ),
  DialogFooter: ({
    children,
    className,
  }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="dialog-footer" className={className}>
      {children}
    </div>
  ),
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({
    onClick,
    variant,
    size,
    className,
    children,
    disabled,
    type,
    title,
  }: React.PropsWithChildren<{
    onClick?: () => void
    variant?: string
    size?: string
    className?: string
    disabled?: boolean
    type?: 'button' | 'submit'
    title?: string
  }>) => (
    <button
      data-testid="button"
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      className={className}
      disabled={disabled}
      type={type}
      title={title}
    >
      {children}
    </button>
  ),
}))

jest.mock('@/components/ui/label', () => ({
  Label: ({
    htmlFor,
    children,
    className,
  }: React.PropsWithChildren<{ htmlFor?: string; className?: string }>) => (
    <label data-testid="label" htmlFor={htmlFor} className={className}>
      {children}
    </label>
  ),
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({
    id,
    type,
    min,
    value,
    onChange,
    placeholder,
    className,
    ref,
  }: {
    id?: string
    type?: string
    min?: string
    value: string | number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    className?: string
    ref?: React.RefObject<HTMLInputElement>
  }) => (
    <input
      data-testid={id ?? 'input'}
      id={id}
      type={type}
      min={min}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      ref={ref}
    />
  ),
}))

jest.mock('@/components/ui/select', () => ({
  Select: ({
    value,
    onValueChange,
    children,
  }: React.PropsWithChildren<{
    value: string
    onValueChange: (value: string) => void
  }>) => (
    <div
      data-testid="select"
      data-value={value}
      data-onvaluechange={String(onValueChange !== undefined)}
      onClick={() => onValueChange && onValueChange('daysCount')}
    >
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: React.PropsWithChildren) => (
    <div data-testid="select-trigger">{children}</div>
  ),
  SelectValue: ({
    placeholder,
    children,
  }: React.PropsWithChildren<{ placeholder: string }>) => (
    <div data-testid="select-value" data-placeholder={placeholder}>
      {children ?? placeholder}
    </div>
  ),
  SelectContent: ({ children }: React.PropsWithChildren) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({
    value,
    children,
  }: React.PropsWithChildren<{ value: string }>) => (
    <div
      data-testid={`select-item-${value}`}
      data-value={value}
      onClick={(e) => {
        // Find parent Select
        const select = e.currentTarget.closest('[data-testid="select"]')
        if (select) {
          // Get the onValueChange prop from the parent component
          const parentComponent = select.closest('[data-testid="filter-modal"]')
          if (parentComponent) {
            // Use fireEvent to simulate a change in the select value
            fireEvent.change(select, { target: { value } })
          }
        }
      }}
    >
      {children}
    </div>
  ),
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({
    children,
    variant,
    className,
  }: React.PropsWithChildren<{ variant?: string; className?: string }>) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  ),
}))

describe('FilterModal Component', () => {
  const mockOnClose = jest.fn()
  const mockOnApplyFilters = jest.fn()

  const defaultFilters: ItineraryFilters = {
    tags: '',
    sortBy: '',
    order: '',
  }

  const availableTags = [
    { id: 'tag-1', name: 'Beach' },
    { id: 'tag-2', name: 'Mountain' },
    { id: 'tag-3', name: 'City' },
    { id: 'tag-4', name: 'Food' },
    { id: 'tag-5', name: 'Adventure' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders closed when open is false', () => {
    render(
      <FilterModal
        open={false}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    // Dialog should exist but be closed
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false')
  })

  test('renders open when open is true', () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    // Dialog should be open
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')

    // Check if title and description are rendered
    expect(screen.getByTestId('dialog-title')).toHaveTextContent(
      'Filter Itinerary'
    )
    expect(screen.getByTestId('dialog-description')).toHaveTextContent(
      'Sesuaikan pencarian'
    )
  })

  test('calls onClose when dialog is closed', () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    // Mock the Dialog's onOpenChange callback
    const dialog = screen.getByTestId('dialog')
    const onOpenChange = dialog.getAttribute('data-onchange')

    // Ensure the onOpenChange prop is passed to Dialog
    expect(onOpenChange).toBe('true')
  })

  test('initializes with provided filters', () => {
    const initialFilters: ItineraryFilters = {
      tags: 'tag-1,tag-3',
      sortBy: 'daysCount',
      order: 'asc',
      minDaysCount: '3',
      maxDaysCount: '7',
    }

    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={initialFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    // Check if tag badges are rendered
    expect(screen.getByText('Beach')).toBeInTheDocument()
    expect(screen.getByText('City')).toBeInTheDocument()

    // Check if min and max days inputs are filled
    expect(screen.getByTestId('minDays')).toHaveValue(3)
    expect(screen.getByTestId('maxDays')).toHaveValue(7)

    // Check if sort option is selected
    expect(screen.getByTestId('select')).toHaveAttribute(
      'data-value',
      'daysCount'
    )
  })

  test('handles reset button click', async () => {
    const initialFilters: ItineraryFilters = {
      tags: 'tag-1',
      sortBy: 'daysCount',
      order: 'asc',
      minDaysCount: '3',
      maxDaysCount: '7',
    }

    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={initialFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    // Find and click the reset button
    const buttons = screen.getAllByTestId('button')
    const resetButton = buttons.find((button) =>
      button.textContent?.includes('Reset Filter')
    )
    await act(async () => {
      fireEvent.click(resetButton!)
    })

    // Check if filter value is reset
    expect(screen.queryByText('Beach')).not.toBeInTheDocument()
    expect(screen.getByTestId('minDays')).toHaveValue(null)
    expect(screen.getByTestId('maxDays')).toHaveValue(null)
    expect(screen.getByTestId('select')).toHaveAttribute('data-value', '')
  })

  test('handles apply button click with valid inputs', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    // Add a tag
    const tagSearchInput = screen.getByTestId('tagSearch')
    await act(async () => {
      fireEvent.change(tagSearchInput, { target: { value: 'Beach' } })
      fireEvent.click(screen.getByText('Beach'))
    })

    // Set min and max days
    const minDaysInput = screen.getByTestId('minDays')
    const maxDaysInput = screen.getByTestId('maxDays')
    await act(async () => {
      fireEvent.change(minDaysInput, { target: { value: '2' } })
      fireEvent.change(maxDaysInput, { target: { value: '5' } })
    })

    // Find and click the apply button
    const buttons = screen.getAllByTestId('button')
    const applyButton = buttons.find((button) =>
      button.textContent?.includes('Terapkan Filter')
    )
    await act(async () => {
      fireEvent.click(applyButton!)
    })

    // Check if onApplyFilters was called with the updated filters
    expect(mockOnApplyFilters).toHaveBeenCalledWith({
      tags: 'tag-1',
      sortBy: '',
      order: '',
      minDaysCount: '2',
      maxDaysCount: '5',
    })

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled()
  })

  test('disables apply button when range is invalid', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    // Set invalid range (min > max)
    const minDaysInput = screen.getByTestId('minDays')
    const maxDaysInput = screen.getByTestId('maxDays')
    await act(async () => {
      fireEvent.change(minDaysInput, { target: { value: '5' } })
      fireEvent.change(maxDaysInput, { target: { value: '3' } })
    })

    // Warning message should be displayed
    expect(
      screen.getByText('Nilai minimal lebih besar dari nilai maksimal')
    ).toBeInTheDocument()

    // Find the apply button - it should be disabled
    const buttons = screen.getAllByTestId('button')
    const applyButton = buttons.find((button) =>
      button.textContent?.includes('Terapkan Filter')
    )
    expect(applyButton).toHaveAttribute('disabled')

    // Clicking the apply button should not do anything
    await act(async () => {
      fireEvent.click(applyButton!)
    })

    expect(mockOnApplyFilters).not.toHaveBeenCalled()
  })

  test('validates range correctly for various input combinations', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    const minDaysInput = screen.getByTestId('minDays')
    const maxDaysInput = screen.getByTestId('maxDays')
    const warningSelector = () =>
      screen.queryByText('Nilai minimal lebih besar dari nilai maksimal')
    const buttons = screen.getAllByTestId('button')
    const applyButton = buttons.find((button) =>
      button.textContent?.includes('Terapkan Filter')
    )!

    // Both empty - valid
    await act(async () => {
      fireEvent.change(minDaysInput, { target: { value: '' } })
      fireEvent.change(maxDaysInput, { target: { value: '' } })
    })
    expect(warningSelector()).not.toBeInTheDocument()
    expect(applyButton).not.toHaveAttribute('disabled')

    // Only min - valid
    await act(async () => {
      fireEvent.change(minDaysInput, { target: { value: '2' } })
      fireEvent.change(maxDaysInput, { target: { value: '' } })
    })
    expect(warningSelector()).not.toBeInTheDocument()
    expect(applyButton).not.toHaveAttribute('disabled')

    // Only max - valid
    await act(async () => {
      fireEvent.change(minDaysInput, { target: { value: '' } })
      fireEvent.change(maxDaysInput, { target: { value: '5' } })
    })
    expect(warningSelector()).not.toBeInTheDocument()
    expect(applyButton).not.toHaveAttribute('disabled')

    // Min < Max - valid
    await act(async () => {
      fireEvent.change(minDaysInput, { target: { value: '2' } })
      fireEvent.change(maxDaysInput, { target: { value: '5' } })
    })
    expect(warningSelector()).not.toBeInTheDocument()
    expect(applyButton).not.toHaveAttribute('disabled')

    // Min = Max - valid
    await act(async () => {
      fireEvent.change(minDaysInput, { target: { value: '5' } })
      fireEvent.change(maxDaysInput, { target: { value: '5' } })
    })
    expect(warningSelector()).not.toBeInTheDocument()
    expect(applyButton).not.toHaveAttribute('disabled')

    // Min > Max - invalid
    await act(async () => {
      fireEvent.change(minDaysInput, { target: { value: '7' } })
      fireEvent.change(maxDaysInput, { target: { value: '5' } })
    })
    expect(warningSelector()).toBeInTheDocument()
    expect(applyButton).toHaveAttribute('disabled')
  })

  test('filters and displays available tags based on search query', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    const tagSearchInput = screen.getByTestId('tagSearch')

    // Search for 'Be' - should show Beach but not others
    await act(async () => {
      fireEvent.change(tagSearchInput, { target: { value: 'Be' } })
      fireEvent.focus(tagSearchInput)
    })

    // Wait for the dropdown to appear
    await waitFor(() => {
      // Beach should be findable
      expect(screen.getByText('Beach')).toBeInTheDocument()

      // Mountain should not be findable
      expect(screen.queryByText('Mountain')).not.toBeInTheDocument()
    })
  })

  test('toggles sort order with the order button', async () => {
    const initialFilters: ItineraryFilters = {
      tags: '',
      sortBy: 'daysCount',
      order: 'asc',
    }

    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={initialFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    // Initially, ArrowUp should be shown (for 'asc')
    expect(screen.getByTestId('arrow-up')).toBeInTheDocument()
    expect(screen.queryByTestId('arrow-down')).not.toBeInTheDocument()

    // Get the sort order toggle button
    const orderButton = screen
      .getAllByTestId('button')
      .find((button) => button.title === 'Menaik')

    await act(async () => {
      fireEvent.click(orderButton!)
    })

    // Now, ArrowDown should be shown (for 'desc')
    expect(screen.queryByTestId('arrow-up')).not.toBeInTheDocument()
    expect(screen.getByTestId('arrow-down')).toBeInTheDocument()

    // Button title should update
    expect(orderButton?.title).toBe('Menurun')
  })

  test('adds and removes tags correctly', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    const tagSearchInput = screen.getByTestId('tagSearch')

    // Add 'Beach' tag
    await act(async () => {
      fireEvent.change(tagSearchInput, { target: { value: 'Be' } })
      fireEvent.focus(tagSearchInput)
    })

    // Wait for dropdown to appear and click the tag
    await waitFor(() => {
      const beachOption = screen.getByText(/^Beach$/)
      fireEvent.click(beachOption)
    })

    // Beach tag badge should be visible
    await waitFor(() => {
      expect(screen.getByText(/^Beach$/)).toBeInTheDocument()
    })

    // Add 'Mountain' tag
    await act(async () => {
      fireEvent.change(tagSearchInput, { target: { value: 'Mo' } })
    })

    await waitFor(() => {
      const mountainOption = screen.getByText(/^Mountain$/)
      fireEvent.click(mountainOption)
    })

    // Both tags should be visible
    await waitFor(() => {
      expect(screen.getByText(/^Beach$/)).toBeInTheDocument()
      expect(screen.getByText(/^Mountain$/)).toBeInTheDocument()
    })

    // Remove Beach tag
    const removeButtons = screen.getAllByTestId('x-icon')
    await act(async () => {
      fireEvent.click(removeButtons[0])
    })

    // Only Mountain should remain
    await waitFor(() => {
      expect(screen.queryByText(/^Beach$/)).not.toBeInTheDocument()
      expect(screen.getByText(/^Mountain$/)).toBeInTheDocument()
    })
  })

  test('resets local filters when props change', async () => {
    const { rerender } = render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    // Add a tag, set min and max days
    const tagSearchInput = screen.getByTestId('tagSearch')
    await act(async () => {
      fireEvent.change(tagSearchInput, { target: { value: 'Beach' } })
      fireEvent.click(screen.getByText('Beach'))
    })

    const minDaysInput = screen.getByTestId('minDays')
    const maxDaysInput = screen.getByTestId('maxDays')
    await act(async () => {
      fireEvent.change(minDaysInput, { target: { value: '2' } })
      fireEvent.change(maxDaysInput, { target: { value: '5' } })
    })

    // Verify the changes were applied
    expect(screen.getByText('Beach')).toBeInTheDocument()
    expect(minDaysInput).toHaveValue(2)
    expect(maxDaysInput).toHaveValue(5)

    // Rerender with new props
    const newFilters: ItineraryFilters = {
      tags: 'tag-3',
      sortBy: 'createdAt',
      order: 'desc',
      minDaysCount: '1',
      maxDaysCount: '3',
    }

    await act(async () => {
      rerender(
        <FilterModal
          open={true}
          onClose={mockOnClose}
          filters={newFilters}
          onApplyFilters={mockOnApplyFilters}
          availableTags={availableTags}
        />
      )
    })

    // Use waitFor to ensure state has updated
    await waitFor(() => {
      // City tag should be visible (from tag-3)
      expect(screen.getByText('City')).toBeInTheDocument()

      // No badge with Beach text should be visible (we need to be precise about what we're looking for)
      const badges = screen.getAllByTestId('badge')
      const beachBadge = badges.find((badge) => badge.textContent === 'Beach')
      expect(beachBadge).toBeUndefined()

      // Check min/max days
      expect(screen.getByTestId('minDays')).toHaveValue(1)
      expect(screen.getByTestId('maxDays')).toHaveValue(3)
    })
  })

  test('only allows numeric inputs for min and max days', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    const minDaysInput = screen.getByTestId('minDays')

    // Try to input non-numeric values
    await act(async () => {
      fireEvent.change(minDaysInput, { target: { value: 'abc' } })
    })
    expect(minDaysInput).toHaveValue(null)

    // Try to input negative numbers (should not work)
    await act(async () => {
      fireEvent.change(minDaysInput, { target: { value: '-5' } })
    })
    expect(minDaysInput).toHaveValue(null)

    // Try to input valid number
    await act(async () => {
      fireEvent.change(minDaysInput, { target: { value: '5' } })
    })
    expect(minDaysInput).toHaveValue(5)
  })

  // New test for handleClickOutside
  test('closes tag dropdown when clicking outside', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    const tagSearchInput = screen.getByTestId('tagSearch')

    // Focus and add text to open the dropdown
    await act(async () => {
      fireEvent.focus(tagSearchInput)
      fireEvent.change(tagSearchInput, { target: { value: 'Be' } })
    })

    // Verify dropdown is visible
    await waitFor(() => {
      expect(screen.getByText('Beach')).toBeInTheDocument()
    })

    // Simulate a mousedown outside
    await act(async () => {
      const mousedownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      })
      document.body.dispatchEvent(mousedownEvent)
    })

    // Dropdown should be closed (Beach should no longer be visible)
    await waitFor(() => {
      expect(screen.queryByText(/^Beach$/)).not.toBeInTheDocument()
    })
  })

  test('calls onClose when dialog is closed via onOpenChange', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    // Initially open dialog
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')

    // Click the dialog to trigger onOpenChange(false)
    await act(async () => {
      fireEvent.click(screen.getByTestId('dialog'))
    })

    // onClose should be called
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test('updates localFilters.sortBy when Select onValueChange is triggered', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
        availableTags={availableTags}
      />
    )

    // Initially, sort option should be empty
    const selectElement = screen.getByTestId('select')
    expect(selectElement).toHaveAttribute('data-value', '')

    // Click the select to trigger onValueChange('daysCount')
    await act(async () => {
      fireEvent.click(selectElement)
    })

    // The sort value should now be updated
    expect(selectElement).toHaveAttribute('data-value', 'daysCount')

    // Now test that when we apply the filters, the updated sortBy value is included
    const buttons = screen.getAllByTestId('button')
    const applyButton = buttons.find((button) =>
      button.textContent?.includes('Terapkan Filter')
    )

    await act(async () => {
      fireEvent.click(applyButton!)
    })

    // Check that onApplyFilters was called with the updated sortBy value
    expect(mockOnApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: 'daysCount',
      })
    )
  })
})
