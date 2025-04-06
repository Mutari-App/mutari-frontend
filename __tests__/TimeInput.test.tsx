import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TimeInput } from '@/modules/ItineraryMakerModule/module-elements/TimeInput'
import '@testing-library/jest-dom'
import { TimePicker } from '@/modules/ItineraryMakerModule/module-elements/TimePicker'

jest.mock('@/modules/ItineraryMakerModule/module-elements/TimePicker', () => ({
  TimePicker: jest.fn(
    ({
      label,
      value,
      onChange,
    }: {
      value?: Date
      onChange: (date?: Date) => void
      label?: string
    }) => (
      <div data-testid={`time-picker-${label?.toLowerCase()}`}>
        <button onClick={() => onChange(new Date('2023-01-01T10:00:00Z'))}>
          {label}: {value ? value.toISOString() : 'Not set'}
        </button>
      </div>
    )
  ),
}))

jest.mock('lucide-react', () => ({
  Clock: () => 'Clock',
  X: () => 'X',
}))

describe('TimeInput Component', () => {
  const mockToggleInput = jest.fn()
  const mockUpdateBlock = jest.fn()
  const mockRemoveFeedbackForField = jest.fn()
  const blockId = 'test-block-123'
  const sectionNumber = 1

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders the "Set Waktu" button when not visible', () => {
    render(
      <TimeInput
        sectionNumber={sectionNumber}
        blockId={blockId}
        isVisible={false}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        timeWarning={null}
      />
    )

    const setTimeButton = screen.getByRole('button', { name: /Set Waktu/i })
    expect(setTimeButton).toBeInTheDocument()

    fireEvent.click(setTimeButton)
    expect(mockToggleInput).toHaveBeenCalledWith(blockId, 'time')
  })

  test('renders the time pickers when visible', () => {
    render(
      <TimeInput
        sectionNumber={sectionNumber}
        blockId={blockId}
        isVisible={true}
        startTime="2023-01-01T09:00:00Z"
        endTime="2023-01-01T11:00:00Z"
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        timeWarning={null}
      />
    )

    expect(screen.getByTestId('time-picker-awal')).toBeInTheDocument()
    expect(screen.getByTestId('time-picker-akhir')).toBeInTheDocument()

    // Check for close button - using X text instead of empty name
    const closeButton = screen.getByRole('button', { name: 'X' })
    expect(closeButton).toBeInTheDocument()

    fireEvent.click(closeButton)
    expect(mockToggleInput).toHaveBeenCalledWith(blockId, 'time')
  })

  test('calls updateBlock when time values change', () => {
    render(
      <TimeInput
        sectionNumber={sectionNumber}
        blockId={blockId}
        isVisible={true}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        timeWarning={null}
      />
    )

    // Click the start time button which triggers onChange with a new date
    fireEvent.click(screen.getByText(/Awal:/i))
    expect(mockUpdateBlock).toHaveBeenCalledWith(
      blockId,
      'startTime',
      new Date('2023-01-01T10:00:00Z').toISOString()
    )

    // Click the end time button which triggers onChange with a new date
    fireEvent.click(screen.getByText(/Akhir:/i))
    expect(mockUpdateBlock).toHaveBeenCalledWith(
      blockId,
      'endTime',
      new Date('2023-01-01T10:00:00Z').toISOString()
    )
  })

  test('displays warning message when timeWarning is provided', () => {
    const warningMessage = 'Waktu akhir harus setelah waktu awal'
    render(
      <TimeInput
        sectionNumber={sectionNumber}
        blockId={blockId}
        isVisible={true}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        timeWarning={{
          blockId,
          message: warningMessage,
        }}
      />
    )

    expect(screen.getByText(warningMessage)).toBeInTheDocument()
  })

  test('does not display warning message for a different blockId', () => {
    const warningMessage = 'Waktu akhir harus setelah waktu awal'
    render(
      <TimeInput
        sectionNumber={sectionNumber}
        blockId={blockId}
        isVisible={true}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        timeWarning={{
          blockId: 'different-block-id',
          message: warningMessage,
        }}
      />
    )

    expect(screen.queryByText(warningMessage)).not.toBeInTheDocument()
  })

  test('passes correct time values to TimePicker components', () => {
    const startTime = '2023-01-01T09:00:00Z'
    const endTime = '2023-01-01T11:00:00Z'

    render(
      <TimeInput
        sectionNumber={sectionNumber}
        blockId={blockId}
        isVisible={true}
        startTime={startTime}
        endTime={endTime}
        toggleInput={mockToggleInput}
        updateBlock={mockUpdateBlock}
        removeFeedbackForField={mockRemoveFeedbackForField}
        timeWarning={null}
      />
    )

    const mockedTimePicker = TimePicker as jest.MockedFunction<
      typeof TimePicker
    >

    expect(mockedTimePicker).toHaveBeenCalledTimes(2)

    const calls = mockedTimePicker.mock.calls
    expect(calls).toEqual(
      expect.arrayContaining([
        [
          expect.objectContaining({
            label: 'Awal',
            value: new Date(startTime),
            onChange: expect.any(Function) as unknown as (date?: Date) => void,
          }),
        ],
        [
          expect.objectContaining({
            label: 'Akhir',
            value: new Date(endTime),
            onChange: expect.any(Function) as unknown as (date?: Date) => void,
          }),
        ],
      ])
    )
  })
})
