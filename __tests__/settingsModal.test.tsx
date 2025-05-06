import React from 'react'
import { render, fireEvent, screen, act } from '@testing-library/react'
import { SettingsItineraryModal } from '@/modules/ItineraryMakerModule/module-elements/settingsModal'
import type { CloudinaryUploadWidgetResults } from 'next-cloudinary'
// Mock the Lucide React icons
jest.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon">X Icon</div>,
  Clipboard: () => <div data-testid="clipboard-icon">Clipboard Icon</div>,
  Trash: () => <div data-testid="trash-icon">Trash Icon</div>,
}))
// Mock types for next-cloudinary
interface MockCldUploadButtonProps {
  onSuccess?: (result: CloudinaryUploadWidgetResults) => void
  children?: React.ReactNode
  uploadPreset?: string
  options?: Record<string, any>
  className?: string
  disabled?: boolean
}
// Mock next-cloudinary
jest.mock('next-cloudinary', () => ({
  __esModule: true,
  CldUploadButton: ({
    onSuccess,
    children,
    ...props
  }: MockCldUploadButtonProps) => (
    <button
      data-testid="mock-upload-button"
      onClick={() =>
        onSuccess?.({
          info: { secure_url: 'https://example.com/image.jpg' },
        } as CloudinaryUploadWidgetResults)
      }
      {...props}
    >
      {children}
    </button>
  ),
}))
// Mock the UI components
jest.mock('@/components/ui/button', () => ({
  buttonVariants: jest.fn(() => 'mocked-button-variants'),
}))
// Mock textarea with proper types
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
  value?: string
}
jest.mock('@/components/ui/textarea', () => ({
  Textarea: ({ onChange, value, ...props }: TextareaProps) => (
    <textarea
      data-testid="textarea"
      onChange={onChange}
      value={value || ''}
      {...props}
    />
  ),
}))
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}))
// Mock the environment variable
process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = 'test-preset'
describe('SettingsItineraryModal', () => {
  const mockOnSave = jest.fn()
  const mockOnClose = jest.fn()
  const mockOnDuplicate = jest.fn()
  const mockOnCoverImageChange = jest.fn()
  const mockOnTitleChange = jest.fn()
  const mockOnDescChange = jest.fn()
  const defaultProps = {
    isOpen: true,
    itineraryId: 'itn-123',
    title: 'Test Title',
    description: 'Test Description',
    coverImage: 'https://example.com/existing-image.jpg',
    isPublished: false,
    onClose: mockOnClose,
    onSave: mockOnSave,
    onDuplicate: mockOnDuplicate,
    onCoverImageChange: mockOnCoverImageChange,
    onTitleChange: mockOnTitleChange,
    onDescChange: mockOnDescChange,
    isContingency: false,
  }
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('renders correctly when isOpen is true', () => {
    render(<SettingsItineraryModal {...defaultProps} />)
    expect(screen.getByText('Itinerary Settings')).toBeInTheDocument()
    expect(screen.getByText('Judul')).toBeInTheDocument()
    expect(screen.getByText('Deskripsi')).toBeInTheDocument()
    expect(screen.getByText('Ganti foto cover')).toBeInTheDocument()
  })
  it('does not render when isOpen is false', () => {
    render(<SettingsItineraryModal {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Itinerary Settings')).not.toBeInTheDocument()
  })
  it('updates the title and description on input change', () => {
    render(<SettingsItineraryModal {...defaultProps} />)
    // Find textareas
    const titleTextarea = screen.getAllByTestId(
      'textarea'
    )[0] as HTMLTextAreaElement
    const descriptionTextarea = screen.getAllByTestId(
      'textarea'
    )[1] as HTMLTextAreaElement
    // Change values
    fireEvent.change(titleTextarea, { target: { value: 'Updated Title' } })
    fireEvent.change(descriptionTextarea, {
      target: { value: 'Updated Description' },
    })
    // Check if the values are updated
    expect(titleTextarea.value).toBe('Updated Title')
    expect(descriptionTextarea.value).toBe('Updated Description')
  })
  it('calls onSave with correct data when save button is clicked', async () => {
    render(<SettingsItineraryModal {...defaultProps} />)
    // Find textareas and update them
    const titleTextarea = screen.getAllByTestId(
      'textarea'
    )[0] as HTMLTextAreaElement
    const descriptionTextarea = screen.getAllByTestId(
      'textarea'
    )[1] as HTMLTextAreaElement
    fireEvent.change(titleTextarea, { target: { value: 'Updated Title' } })
    fireEvent.change(descriptionTextarea, {
      target: { value: 'Updated Description' },
    })
    // Click save button
    fireEvent.click(screen.getByText('Simpan'))
    // Check if onSave was called with the right parameters
    expect(mockOnSave).toHaveBeenCalledWith({
      title: 'Updated Title',
      description: 'Updated Description',
      coverImage: 'https://example.com/existing-image.jpg',
      isPublished: false,
    })
    expect(mockOnClose).toHaveBeenCalled()
  })
  it('calls onDuplicate when duplicate button is clicked', () => {
    render(<SettingsItineraryModal {...defaultProps} />)
    // Find and click the duplicate button
    const duplicateButton = screen.getByText(/duplikat itinerary/i)
    fireEvent.click(duplicateButton)
    // Check if onDuplicate was called with the right parameters
    expect(mockOnDuplicate).toHaveBeenCalledWith({
      itineraryId: 'itn-123',
    })
    expect(mockOnClose).toHaveBeenCalled()
  })
  it('calls onClose when close button is clicked', () => {
    render(<SettingsItineraryModal {...defaultProps} />)
    // Find and click the close button
    const closeButton = screen.getByTestId('x-icon')
      .parentElement! as HTMLElement
    fireEvent.click(closeButton)
    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled()
  })
  it('correctly toggles visibility between public and private', () => {
    render(<SettingsItineraryModal {...defaultProps} />)
    // Check default state (private)
    const privateRadio = screen.getByLabelText(/private/i) as HTMLInputElement
    const publicRadio = screen.getByLabelText(/public/i) as HTMLInputElement
    expect(privateRadio.checked).toBe(true)
    expect(publicRadio.checked).toBe(false)
    // Toggle to public
    fireEvent.click(publicRadio)
    expect(privateRadio.checked).toBe(false)
    expect(publicRadio.checked).toBe(true)
    // Save and check the isPublished parameter
    fireEvent.click(screen.getByText('Simpan'))
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        isPublished: true,
      })
    )
  })
  it('initializes with public visibility when isPublished is true', () => {
    render(<SettingsItineraryModal {...defaultProps} isPublished={true} />)
    // Check that the public radio is selected
    const publicRadio = screen.getByLabelText(/public/i) as HTMLInputElement
    expect(publicRadio.checked).toBe(true)
  })
  it('correctly handles cover image upload', () => {
    render(<SettingsItineraryModal {...defaultProps} />)
    // Find and click the upload button
    const uploadButton = screen.getByTestId('mock-upload-button')
    fireEvent.click(uploadButton)
    // Check if onCoverImageChange was called with the mocked result
    expect(mockOnCoverImageChange).toHaveBeenCalledWith(
      expect.objectContaining({
        info: { secure_url: 'https://example.com/image.jpg' },
      })
    )
  })
  it('disables the save button when isContingency is true', () => {
    render(<SettingsItineraryModal {...defaultProps} isContingency={true} />)
    // Check if the save button is disabled
    const saveButton = screen.getByText('Simpan') as HTMLButtonElement
    expect(saveButton.disabled).toBe(true)
  })
  it('correctly updates state when props change', async () => {
    const { rerender } = render(<SettingsItineraryModal {...defaultProps} />)
    // Update props
    rerender(
      <SettingsItineraryModal
        {...defaultProps}
        title="New Title"
        description="New Description"
        isPublished={true}
      />
    )
    // Toggle the modal closed and then open to trigger the useEffect
    rerender(
      <SettingsItineraryModal
        {...defaultProps}
        isOpen={false}
        title="New Title"
        description="New Description"
        isPublished={true}
      />
    )
    rerender(
      <SettingsItineraryModal
        {...defaultProps}
        title="New Title"
        description="New Description"
        isPublished={true}
      />
    )
    // Check if local state is updated correctly
    const titleTextarea = screen.getAllByTestId(
      'textarea'
    )[0] as HTMLTextAreaElement
    const descriptionTextarea = screen.getAllByTestId(
      'textarea'
    )[1] as HTMLTextAreaElement
    const publicRadio = screen.getByLabelText(/public/i) as HTMLInputElement
    expect(titleTextarea.value).toBe('New Title')
    expect(descriptionTextarea.value).toBe('New Description')
    expect(publicRadio.checked).toBe(true)
  })
  it('changes visibility to private when private radio is clicked', () => {
    render(<SettingsItineraryModal {...defaultProps} isPublished={true} />)

    // Initially, it should be public since isPublished is true
    const privateRadio = screen.getByLabelText(/private/i) as HTMLInputElement
    const publicRadio = screen.getByLabelText(/public/i) as HTMLInputElement
    expect(privateRadio.checked).toBe(false)
    expect(publicRadio.checked).toBe(true)

    // Click on private radio
    fireEvent.click(privateRadio)

    // Verify state change
    expect(privateRadio.checked).toBe(true)
    expect(publicRadio.checked).toBe(false)

    // Save and check that isPublished is now false
    fireEvent.click(screen.getByText('Simpan'))
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        isPublished: false,
      })
    )
  })

  it('sets gradient background when no coverImage is provided', () => {
    // Render with coverImage set to undefined
    render(<SettingsItineraryModal {...defaultProps} coverImage={undefined} />)

    // Find the cover image container
    const coverContainer =
      screen.getByText('Ganti foto cover').parentElement?.parentElement

    // Verify the background is set to the gradient
    expect(coverContainer).toHaveStyle({
      backgroundImage: 'linear-gradient(360deg, #004080, #0073E6, #60A5FA)',
    })
  })
})
