import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { SettingsItineraryModal } from '@/modules/ItineraryMakerModule/module-elements/settingsModal' // Adjust path if needed

jest.mock('lucide-react', () => ({
  X: 'X',
  Clipboard: 'Clipboard',
  Trash: 'Trash',
}))

describe('SettingsItineraryModal', () => {
  const mockOnSave = jest.fn()
  const mockOnClose = jest.fn()
  const mockOnCoverImageChange = jest.fn()

  const defaultProps = {
    isOpen: true,
    title: 'Test Title',
    description: 'Test Description',
    isPublished: false,
    onClose: mockOnClose,
    onSave: mockOnSave,
    onCoverImageChange: mockOnCoverImageChange,
    onTitleChange: jest.fn(),
    onDescChange: jest.fn(),
    isContingency: false,
  }

  it('renders correctly when isOpen is true', () => {
    render(<SettingsItineraryModal {...defaultProps} />)
    expect(screen.getByText('Itinerary Settings')).toBeInTheDocument()
    expect(screen.getByLabelText('Judul')).toBeInTheDocument()
    expect(screen.getByLabelText('Deskripsi')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<SettingsItineraryModal {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Itinerary Settings')).not.toBeInTheDocument()
  })

  it('updates the title and description on input change', () => {
    render(<SettingsItineraryModal {...defaultProps} />)

    fireEvent.change(screen.getByPlaceholderText('Masukkan Judul Perjalanan'), {
      target: { value: 'Updated Title' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('Masukkan Deskripsi Perjalanan'),
      {
        target: { value: 'Updated Description' },
      }
    )

    expect(
      (
        screen.getByPlaceholderText(
          'Masukkan Judul Perjalanan'
        ) as HTMLInputElement
      ).value
    ).toBe('Updated Title')
    expect(
      (
        screen.getByPlaceholderText(
          'Masukkan Deskripsi Perjalanan'
        ) as HTMLInputElement
      ).value
    ).toBe('Updated Description')
  })

  it('calls onSave with correct data when save button is clicked', async () => {
    render(<SettingsItineraryModal {...defaultProps} />)

    fireEvent.change(screen.getByPlaceholderText('Masukkan Judul Perjalanan'), {
      target: { value: 'Updated Title' },
    })
    fireEvent.change(
      screen.getByPlaceholderText('Masukkan Deskripsi Perjalanan'),
      {
        target: { value: 'Updated Description' },
      }
    )

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }))

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'Updated Title',
        description: 'Updated Description',
        coverImage: undefined,
        isPublished: false,
      })
    })
  })
})
