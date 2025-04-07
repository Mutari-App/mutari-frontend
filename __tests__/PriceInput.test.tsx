import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PriceInput } from '@/modules/ItineraryMakerModule/module-elements/PriceInput'
import '@testing-library/jest-dom'

jest.mock('lucide-react', () => ({
  Tag: () => 'Tag',
  X: () => 'X',
}))

describe('PriceInput Component', () => {
  const mockToggleInput = jest.fn()
  const mockUpdateBlock = jest.fn()
  const mockRemoveFeedbackForField = jest.fn()
  const blockId = 'test-block-123'
  const sectionNumber = 1

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders the "Set Harga" button when not visible', () => {
    render(
      <PriceInput
        sectionNumber={sectionNumber}
        blockId={blockId}
        isVisible={false}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
      />
    )

    const setPriceButton = screen.getByRole('button', { name: /Set Harga/i })
    expect(setPriceButton).toBeInTheDocument()

    fireEvent.click(setPriceButton)
    expect(mockToggleInput).toHaveBeenCalledWith(blockId, 'price')
  })

  test('renders the price input field when visible', () => {
    render(
      <PriceInput
        sectionNumber={sectionNumber}
        blockId={blockId}
        isVisible={true}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
      />
    )

    expect(screen.getByPlaceholderText('50000')).toBeInTheDocument()
    expect(screen.getByText('Rp')).toBeInTheDocument()

    // Check for close button
    const closeButton = screen.getByRole('button', { name: 'X' })
    expect(closeButton).toBeInTheDocument()

    fireEvent.click(closeButton)
    expect(mockToggleInput).toHaveBeenCalledWith(blockId, 'price')
  })

  test('calls updateBlock when price value changes', () => {
    render(
      <PriceInput
        sectionNumber={sectionNumber}
        blockId={blockId}
        isVisible={true}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
      />
    )

    const priceInput = screen.getByPlaceholderText('50000')
    fireEvent.change(priceInput, { target: { value: '75000' } })

    expect(mockUpdateBlock).toHaveBeenCalledWith(blockId, 'price', 75000)
  })

  test('displays the current price value when provided', () => {
    const currentPrice = 25000

    render(
      <PriceInput
        sectionNumber={sectionNumber}
        blockId={blockId}
        price={currentPrice}
        isVisible={true}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
      />
    )

    const priceInput = screen.getByPlaceholderText('50000')
    expect(priceInput).toHaveValue(currentPrice)
  })

  test('handles empty price input correctly', () => {
    render(
      <PriceInput
        sectionNumber={sectionNumber}
        blockId={blockId}
        isVisible={true}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        price={50000}
        removeFeedbackForField={mockRemoveFeedbackForField}
      />
    )

    const priceInput = screen.getByPlaceholderText('50000')

    // Clear the input
    fireEvent.change(priceInput, { target: { value: '' } })

    expect(mockUpdateBlock).toHaveBeenCalledWith(blockId, 'price', undefined)
  })
})
