import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import FilterModal from '@/modules/TourSearchResultsModule/module-elements/FilterModal'
import { type TourFilters } from '@/modules/TourSearchResultsModule/interface'

// Mock Lucide icons
jest.mock('lucide-react', () => ({
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
  }: {
    id?: string
    type?: string
    min?: string
    value: string | number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    className?: string
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
    />
  ),
}))

jest.mock('@/components/ui/select', () => {
  return {
    Select: ({
      value,
      onValueChange,
      children,
    }: React.PropsWithChildren<{
      value: string
      onValueChange: (value: string) => void
    }>) => {
      return (
        <div
          data-testid="select"
          data-value={value}
          data-onvaluechange={String(onValueChange !== undefined)}
          onClick={() => onValueChange && onValueChange('pricePerTicket')}
        >
          {children}
        </div>
      )
    },
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
      <div data-testid={`select-item-${value}`} data-value={value}>
        {children}
      </div>
    ),
  }
})

jest.mock('@/components/ui/switch', () => ({
  Switch: ({
    id,
    checked,
    onCheckedChange,
  }: {
    id?: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
  }) => (
    <input
      type="checkbox"
      data-testid={id}
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
    />
  ),
}))

describe('FilterModal Component', () => {
  const mockOnClose = jest.fn()
  const mockOnApplyFilters = jest.fn()

  const defaultFilters: TourFilters = {
    location: '',
    minPrice: '',
    maxPrice: '',
    minDuration: '',
    maxDuration: '',
    durationType: '',
    hasAvailableTickets: false,
    sortBy: '',
    order: '',
  }

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
      />
    )

    // Dialog should be open
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')

    // Check if title and description are rendered
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Filter Tur')
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
      />
    )

    // Mock the Dialog's onOpenChange callback
    const dialog = screen.getByTestId('dialog')
    fireEvent.click(dialog)

    // Ensure onClose was called
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test('initializes with provided filters', () => {
    const initialFilters: TourFilters = {
      location: 'Bali',
      minPrice: '100000',
      maxPrice: '500000',
      minDuration: '2',
      maxDuration: '5',
      durationType: 'DAY',
      hasAvailableTickets: true,
      sortBy: 'pricePerTicket',
      order: 'asc',
    }

    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={initialFilters}
        onApplyFilters={mockOnApplyFilters}
      />
    )

    // Check if inputs are filled with correct values
    expect(screen.getByTestId('minPrice')).toHaveValue('100000')
    expect(screen.getByTestId('maxPrice')).toHaveValue('500000')
    expect(screen.getByTestId('minDuration')).toHaveValue(2)
    expect(screen.getByTestId('maxDuration')).toHaveValue(5)

    // Check if switch is checked
    expect(screen.getByTestId('hasAvailableTickets')).toBeChecked()

    // Check if selects have the right values
    const selects = screen.getAllByTestId('select')
    expect(
      selects.some((select) => select.getAttribute('data-value') === 'DAY')
    ).toBeTruthy()

    expect(
      selects.some(
        (select) => select.getAttribute('data-value') === 'pricePerTicket'
      )
    ).toBeTruthy()
  })

  test('handles reset button click', async () => {
    const initialFilters: TourFilters = {
      location: 'Bali',
      minPrice: '100000',
      maxPrice: '500000',
      minDuration: '2',
      maxDuration: '5',
      durationType: 'DAY',
      hasAvailableTickets: true,
      sortBy: 'pricePerTicket',
      order: 'asc',
    }

    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={initialFilters}
        onApplyFilters={mockOnApplyFilters}
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

    // Check if filter values are reset
    expect(screen.getByTestId('minPrice')).toHaveValue('')
    expect(screen.getByTestId('maxPrice')).toHaveValue('')
    expect(screen.getByTestId('minDuration')).toHaveValue(null)
    expect(screen.getByTestId('maxDuration')).toHaveValue(null)
    expect(screen.getByTestId('hasAvailableTickets')).not.toBeChecked()

    // Check if the selects are reset
    const selects = screen.getAllByTestId('select')
    expect(
      selects.some((select) => select.getAttribute('data-value') === '')
    ).toBeTruthy()
  })

  test('handles apply button click with valid inputs', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
      />
    )

    // Set filter values
    await act(async () => {
      fireEvent.change(screen.getByTestId('minPrice'), {
        target: { value: '200000' },
      })
      fireEvent.change(screen.getByTestId('maxPrice'), {
        target: { value: '800000' },
      })
      fireEvent.change(screen.getByTestId('minDuration'), {
        target: { value: '3' },
      })
      fireEvent.change(screen.getByTestId('maxDuration'), {
        target: { value: '7' },
      })
      fireEvent.click(screen.getByTestId('hasAvailableTickets'))
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
    expect(mockOnApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        minPrice: '200000',
        maxPrice: '800000',
        minDuration: '3',
        maxDuration: '7',
        hasAvailableTickets: true,
      })
    )

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled()
  })

  test('disables apply button when price range is invalid', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
      />
    )

    // Set invalid price range (min > max)
    await act(async () => {
      fireEvent.change(screen.getByTestId('minPrice'), {
        target: { value: '500000' },
      })
      fireEvent.change(screen.getByTestId('maxPrice'), {
        target: { value: '300000' },
      })
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

  test('validates price range correctly for various input combinations', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
      />
    )

    const minPriceInput = screen.getByTestId('minPrice')
    const maxPriceInput = screen.getByTestId('maxPrice')
    const warningSelector = () =>
      screen.queryByText('Nilai minimal lebih besar dari nilai maksimal')
    const buttons = screen.getAllByTestId('button')
    const applyButton = buttons.find((button) =>
      button.textContent?.includes('Terapkan Filter')
    )!

    // Both empty - valid
    await act(async () => {
      fireEvent.change(minPriceInput, { target: { value: '' } })
      fireEvent.change(maxPriceInput, { target: { value: '' } })
    })
    expect(warningSelector()).not.toBeInTheDocument()
    expect(applyButton).not.toHaveAttribute('disabled')

    // Only min - valid
    await act(async () => {
      fireEvent.change(minPriceInput, { target: { value: '200000' } })
      fireEvent.change(maxPriceInput, { target: { value: '' } })
    })
    expect(warningSelector()).not.toBeInTheDocument()
    expect(applyButton).not.toHaveAttribute('disabled')

    // Min > Max - invalid
    await act(async () => {
      fireEvent.change(minPriceInput, { target: { value: '600000' } })
      fireEvent.change(maxPriceInput, { target: { value: '500000' } })
    })
    expect(warningSelector()).toBeInTheDocument()
    expect(applyButton).toHaveAttribute('disabled')
  })

  test('auto-sets durationType to DAY when duration value is entered', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
      />
    )

    // Add value to minDuration
    await act(async () => {
      fireEvent.change(screen.getByTestId('minDuration'), {
        target: { value: '3' },
      })
    })

    // Find and click the apply button
    const buttons = screen.getAllByTestId('button')
    const applyButton = buttons.find((button) =>
      button.textContent?.includes('Terapkan Filter')
    )

    await act(async () => {
      fireEvent.click(applyButton!)
    })

    // Check if durationType was auto-set to DAY
    expect(mockOnApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        minDuration: '3',
        durationType: 'DAY',
      })
    )
  })

  test('toggles sort order with the order button', async () => {
    const initialFilters: TourFilters = {
      location: '',
      minPrice: '',
      maxPrice: '',
      minDuration: '',
      maxDuration: '',
      durationType: '',
      hasAvailableTickets: false,
      sortBy: 'pricePerTicket',
      order: 'asc',
    }

    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={initialFilters}
        onApplyFilters={mockOnApplyFilters}
      />
    )

    // Initially, ArrowUp should be shown (for 'asc')
    expect(screen.getByTestId('arrow-up')).toBeInTheDocument()

    // Get the sort order toggle button
    const orderButton = screen
      .getAllByTestId('button')
      .find((button) => button.title === 'Menaik')

    await act(async () => {
      fireEvent.click(orderButton!)
    })

    // Now, ArrowDown should be shown (for 'desc')
    expect(screen.getByTestId('arrow-down')).toBeInTheDocument()
    expect(screen.queryByTestId('arrow-up')).not.toBeInTheDocument()
  })

  test('only allows numeric inputs for min and max price', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
      />
    )

    const minPriceInput = screen.getByTestId('minPrice')

    // Try to input non-numeric values
    await act(async () => {
      fireEvent.change(minPriceInput, { target: { value: 'abc' } })
    })
    expect(minPriceInput).toHaveValue('')

    // Try to input valid number
    await act(async () => {
      fireEvent.change(minPriceInput, { target: { value: '5000' } })
    })
    expect(minPriceInput).toHaveValue('5000')
  })

  test('auto-sets durationType to DAY when minDuration is entered without durationType', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
      />
    )

    // Initially the durationType should be empty
    const durationTypeSelect = screen.getAllByTestId('select')[0]
    expect(durationTypeSelect).toHaveAttribute('data-value', '')

    // Add value to minDuration
    await act(async () => {
      fireEvent.change(screen.getByTestId('minDuration'), {
        target: { value: '3' },
      })
    })

    // Check that durationType is automatically set to DAY
    expect(durationTypeSelect).toHaveAttribute('data-value', 'DAY')
  })

  test('validates duration range and sets isDurationRangeValid to false when min > max', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
      />
    )

    // Set an invalid duration range (min > max)
    await act(async () => {
      fireEvent.change(screen.getByTestId('minDuration'), {
        target: { value: '7' },
      })
      fireEvent.change(screen.getByTestId('maxDuration'), {
        target: { value: '3' },
      })
    })

    // A warning message should appear
    expect(
      screen.getByText('Nilai minimal lebih besar dari nilai maksimal')
    ).toBeInTheDocument()

    // The apply button should be disabled
    const buttons = screen.getAllByTestId('button')
    const applyButton = buttons.find((button) =>
      button.textContent?.includes('Terapkan Filter')
    )
    expect(applyButton).toHaveAttribute('disabled')
  })

  test('setting sortBy works correctly', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
      />
    )

    const sortBySelect = screen.getAllByTestId('select')[1]

    // Initially empty
    expect(sortBySelect).toHaveAttribute('data-value', '')

    // Click the select to trigger onValueChange (in our mock this sets to 'pricePerTicket')
    await act(async () => {
      fireEvent.click(sortBySelect)
    })

    // The value should now be set to pricePerTicket based on our mock
    expect(sortBySelect).toHaveAttribute('data-value', 'pricePerTicket')

    // Find and click apply button
    const applyButton = screen
      .getAllByTestId('button')
      .find((button) => button.textContent?.includes('Terapkan Filter'))

    await act(async () => {
      fireEvent.click(applyButton!)
    })

    // Check that onApplyFilters was called with sortBy: 'pricePerTicket'
    expect(mockOnApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: 'pricePerTicket',
      })
    )
  })

  test('auto-sets durationType to DAY when maxDuration is entered without durationType', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
      />
    )

    // Initially the durationType should be empty
    const durationTypeSelect = screen.getAllByTestId('select')[0]
    expect(durationTypeSelect).toHaveAttribute('data-value', '')

    // Add value to maxDuration
    await act(async () => {
      fireEvent.change(screen.getByTestId('maxDuration'), {
        target: { value: '5' },
      })
    })

    // Check that durationType is automatically set to DAY
    expect(durationTypeSelect).toHaveAttribute('data-value', 'DAY')
  })

  test('auto-sets durationType in both useEffect and handleMaxDurationChange', async () => {
    // Create a special test case with a component that has been manipulated
    // to have maxDuration but no durationType
    const partialFilters = {
      ...defaultFilters,
      maxDuration: '5',
      durationType: '', // Explicitly empty durationType
    }

    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={partialFilters}
        onApplyFilters={mockOnApplyFilters}
      />
    )

    // When the component mounts, the useEffect should auto-set durationType to DAY
    // because maxDuration is already set
    const durationTypeSelect = screen.getAllByTestId('select')[0]
    expect(durationTypeSelect).toHaveAttribute('data-value', 'DAY')
  })

  test('handleMaxDurationChange auto-sets durationType to DAY when no durationType is set', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
      />
    )

    // Reset durationType to ensure it's empty
    await act(async () => {
      // Find and click the reset button to ensure durationType is empty
      const buttons = screen.getAllByTestId('button')
      const resetButton = buttons.find((button) =>
        button.textContent?.includes('Reset Filter')
      )
      fireEvent.click(resetButton!)
    })

    // Verify durationType is empty
    const durationTypeSelect = screen.getAllByTestId('select')[0]
    expect(durationTypeSelect).toHaveAttribute('data-value', '')

    // Change maxDuration which should trigger handleMaxDurationChange
    await act(async () => {
      fireEvent.change(screen.getByTestId('maxDuration'), {
        target: { value: '7' },
      })
    })

    // Check that durationType was auto-set to DAY
    expect(durationTypeSelect).toHaveAttribute('data-value', 'DAY')
  })

  test('does not auto-set durationType to DAY when it already has a value', async () => {
    // Create a specific test case with a component that has HOUR durationType
    const customFilters = {
      ...defaultFilters,
      durationType: 'HOUR',
    }

    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={customFilters}
        onApplyFilters={mockOnApplyFilters}
      />
    )

    // Verify initial durationType is HOUR
    const durationTypeSelect = screen.getAllByTestId('select')[0]
    expect(durationTypeSelect).toHaveAttribute('data-value', 'HOUR')

    // Now add a maxDuration value
    await act(async () => {
      fireEvent.change(screen.getByTestId('maxDuration'), {
        target: { value: '8' },
      })
    })

    // durationType should still be HOUR since it already had a value
    expect(durationTypeSelect).toHaveAttribute('data-value', 'HOUR')
  })

  test('auto-sets durationType to DAY via useEffect when minDuration or maxDuration is set', async () => {
    render(
      <FilterModal
        open={true}
        onClose={mockOnClose}
        filters={defaultFilters}
        onApplyFilters={mockOnApplyFilters}
      />
    )

    // Initially the durationType should be empty
    const durationTypeSelect = screen.getAllByTestId('select')[0]
    expect(durationTypeSelect).toHaveAttribute('data-value', '')

    // Set both minDuration and maxDuration
    await act(async () => {
      fireEvent.change(screen.getByTestId('minDuration'), {
        target: { value: '2' },
      })
      fireEvent.change(screen.getByTestId('maxDuration'), {
        target: { value: '5' },
      })
    })

    // The durationType should be set to DAY because of the useEffect
    expect(durationTypeSelect).toHaveAttribute('data-value', 'DAY')
  })
})
