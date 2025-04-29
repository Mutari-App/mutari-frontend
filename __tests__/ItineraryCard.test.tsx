import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { customFetch } from '@/utils/newCustomFetch'
import { type ItineraryData } from '@/modules/ItineraryModule/module-elements/types'
import ItineraryCard from '@/modules/ItineraryModule/module-elements/ItineraryCard'
import { toast } from 'sonner'
import { ImageProps } from 'next/image'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
}))
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...props }: ImageProps) => {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        {...props}
        alt={alt || ''}
        src={typeof props.src === 'string' ? props.src : ''}
      />
    )
  },
}))

// Mock UI components from shadcn
jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode
    asChild?: boolean
  }) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({
    children,
    align,
  }: {
    children: React.ReactNode
    align?: string
  }) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuItem: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode
    onClick?: () => void
    className?: string
  }) => (
    <div data-testid="dropdown-item" onClick={onClick}>
      {children}
    </div>
  ),
}))

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({
    children,
    open,
    onOpenChange,
  }: {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }) => <div data-testid="dialog">{open ? children : null}</div>,
  DialogContent: ({
    children,
    className,
    onClick,
  }: {
    children: React.ReactNode
    className?: string
    onClick?: (e: React.MouseEvent) => void
  }) => (
    <div data-testid="dialog-content" onClick={onClick}>
      {children}
    </div>
  ),
  DialogTitle: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => <div data-testid="dialog-title">{children}</div>,
  DialogDescription: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => <div data-testid="dialog-description">{children}</div>,
  DialogFooter: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => <div data-testid="dialog-footer">{children}</div>,
}))

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({
    children,
    defaultValue,
  }: {
    children: React.ReactNode
    defaultValue?: string
  }) => <div data-testid="tabs">{children}</div>,
  TabsList: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({
    children,
    value,
  }: {
    children: React.ReactNode
    value?: string
  }) => (
    <div data-testid="tabs-trigger" data-value={value}>
      {children}
    </div>
  ),
  TabsContent: ({
    children,
    value,
    className,
  }: {
    children: React.ReactNode
    value?: string
    className?: string
  }) => (
    <div data-testid="tabs-content" data-value={value}>
      {children}
    </div>
  ),
}))

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    className,
    type,
  }: {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    type?: 'button' | 'submit' | 'reset'
  }) => (
    <button data-testid="button" onClick={onClick} type={type}>
      {children}
    </button>
  ),
}))

jest.mock('@/contexts/AuthContext', () => ({
  useAuthContext: () => ({
    user: { id: 'user1' },
  }),
}))

// Mock data for item props
const mockItem: ItineraryData = {
  title: 'Trip to Bali',
  startDate: '2025-03-01',
  endDate: '2025-03-05',
  coverImage: 'https://example.com/images/bali.jpg',
  id: '1',
  userId: 'user1',
  isPublished: false,
  isCompleted: false,
  locationCount: 5,
  pendingInvites: [
    {
      id: 'p1',
      email: 'pending@example.com',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      itineraryId: '1',
    },
  ],
  invitedUsers: [
    {
      id: 'u1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      photoProfile: '/test-profile.jpg',
    },
  ],
}

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
jest.mock('@/utils/newCustomFetch')
jest.mock('lucide-react', () => ({
  MoreHorizontal: () => <div>MoreHorizontal</div>,
  X: () => <div data-testid="x-icon">X</div>,
}))

// Mock hook
jest.mock('@/hooks/useOutsideClick', () => ({
  __esModule: true,
  default: () => null,
}))

describe('ItineraryCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the component correctly', () => {
    render(<ItineraryCard item={mockItem} refresh={jest.fn()} />)

    expect(screen.getByText('Trip to Bali')).toBeInTheDocument()
    expect(screen.getByText('5 Hari • 5 Destinasi')).toBeInTheDocument()
  })

  it('navigates to itinerary detail page when clicked', () => {
    render(<ItineraryCard item={mockItem} refresh={jest.fn()} />)

    // Find the main card element (excluding the dropdown trigger)
    const card =
      screen.getByText('Trip to Bali').closest('div[role="button"]') ||
      screen.getByText('Trip to Bali').closest('div')

    fireEvent.click(card!)
    expect(mockPush).toHaveBeenCalledWith('/itinerary/1')
  })

  it('calls markAsComplete and refresh when option is clicked', async () => {
    const mockRefresh = jest.fn()
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      itinerary: mockItem,
    })

    render(<ItineraryCard item={mockItem} refresh={mockRefresh} />)

    // Click the option button to open dropdown
    fireEvent.click(screen.getByTestId('option-btn'))

    // Find and click the "Mark as Completed" option directly
    const markAsCompleteOption = screen.getByText('Mark as Completed')
    fireEvent.click(markAsCompleteOption)

    await waitFor(() => {
      expect(customFetch).toHaveBeenCalledWith(
        '/itineraries/1/mark-as-complete/',
        { method: 'PATCH' }
      )
      expect(toast.success).toHaveBeenCalledWith(
        'Itinerary marked as complete!'
      )
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('shows error toast when API fails', async () => {
    ;(customFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to mark as complete')
    )
    const mockRefresh = jest.fn()

    render(<ItineraryCard item={mockItem} refresh={mockRefresh} />)

    // Click the option button to open dropdown
    fireEvent.click(screen.getByTestId('option-btn'))

    // Click the mark as completed option
    fireEvent.click(screen.getByText('Mark as Completed'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to mark as complete')
      expect(mockRefresh).not.toHaveBeenCalled()
    })
  })

  it('opens delete confirmation dialog', () => {
    render(<ItineraryCard item={mockItem} refresh={jest.fn()} />)

    // Click the option button
    fireEvent.click(screen.getByTestId('option-btn'))

    // Click delete option
    fireEvent.click(screen.getByText('Delete'))

    // Check if dialog appears with confirmation message
    expect(screen.getByText('Apakah anda yakin?')).toBeInTheDocument()
    expect(
      screen.getByText('Anda ingin menghapus itinerary ini?')
    ).toBeInTheDocument()
  })

  it('deletes itinerary successfully when confirmed', async () => {
    const mockRefresh = jest.fn()
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      message: 'Itinerary deleted',
    })

    render(<ItineraryCard item={mockItem} refresh={mockRefresh} />)

    // Open delete dialog
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Delete'))

    // Confirm deletion
    fireEvent.click(screen.getByText('Hapus'))

    await waitFor(() => {
      expect(customFetch).toHaveBeenCalledWith('/itineraries/1/', {
        method: 'DELETE',
      })
      expect(toast.success).toHaveBeenCalledWith(
        'Itinerary deleted successfully!'
      )
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('shows error toast when delete API fails', async () => {
    const mockRefresh = jest.fn()
    ;(customFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to delete itinerary')
    )

    render(<ItineraryCard item={mockItem} refresh={mockRefresh} />)

    // Open delete dialog
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Delete'))

    // Confirm deletion
    fireEvent.click(screen.getByText('Hapus'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to delete itinerary')
      expect(mockRefresh).not.toHaveBeenCalled()
    })
  })

  it('cancels deletion when cancel button is clicked', () => {
    const mockRefresh = jest.fn()
    render(<ItineraryCard item={mockItem} refresh={mockRefresh} />)

    // Open delete dialog
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Delete'))

    // Cancel deletion
    fireEvent.click(screen.getByText('Batal'))

    expect(customFetch).not.toHaveBeenCalled()
  })

  it('opens invite dialog when invite option is clicked', () => {
    render(<ItineraryCard item={mockItem} refresh={jest.fn()} />)

    // Click the option button
    fireEvent.click(screen.getByTestId('option-btn'))

    // Click invite option
    fireEvent.click(screen.getByText('Invite'))

    // Check if invite dialog appears
    expect(screen.getByText('Masukkan email')).toBeInTheDocument()
  })

  it('handles email input and adds valid emails', () => {
    render(<ItineraryCard item={mockItem} refresh={jest.fn()} />)

    // Open invite dialog
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Invite'))

    // Type valid email and press Enter
    const input = screen.getByPlaceholderText('Email (pisahkan dengan spasi)')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    // Check if email was added
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('handles invalid email input', () => {
    render(<ItineraryCard item={mockItem} refresh={jest.fn()} />)

    // Open invite dialog
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Invite'))

    // Type invalid email and press Enter
    const input = screen.getByPlaceholderText('Email (pisahkan dengan spasi)')
    fireEvent.change(input, { target: { value: 'invalid-email' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    // Check that toast error was shown
    expect(toast.error).toHaveBeenCalledWith('Email tidak valid')
  })

  it('handles email input with spaces', () => {
    render(<ItineraryCard item={mockItem} refresh={jest.fn()} />)

    // Open invite dialog
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Invite'))

    // Type valid email followed by space
    const input = screen.getByPlaceholderText('Email (pisahkan dengan spasi)')
    fireEvent.change(input, { target: { value: 'test@example.com ' } })

    // Check if email was added
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('removes email when X button is clicked', () => {
    render(<ItineraryCard item={mockItem} refresh={jest.fn()} />)

    // Open invite dialog
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Invite'))

    // Add an email
    const input = screen.getByPlaceholderText('Email (pisahkan dengan spasi)')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    // Find and click the X button next to email
    const removeButtons = screen.getAllByTestId('x-icon')
    fireEvent.click(removeButtons[0])

    // Check that email was removed
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument()
  })

  it('removes last email when backspace is pressed on empty input', () => {
    render(<ItineraryCard item={mockItem} refresh={jest.fn()} />)

    // Open invite dialog
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Invite'))

    // Add an email
    const input = screen.getByPlaceholderText('Email (pisahkan dengan spasi)')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    // Press backspace on empty input
    fireEvent.keyDown(input, { key: 'Backspace' })

    // Check that email was removed
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument()
  })

  it('sends invite successfully', async () => {
    const mockRefresh = jest.fn()
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      message: 'Invites sent',
    })

    render(<ItineraryCard item={mockItem} refresh={mockRefresh} />)

    // Open invite dialog
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Invite'))

    // Add an email
    const input = screen.getByPlaceholderText('Email (pisahkan dengan spasi)')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    // Submit the form
    fireEvent.click(screen.getByText('Kirim'))

    await waitFor(() => {
      expect(customFetch).toHaveBeenCalledWith('/itineraries/1/invite/', {
        method: 'POST',
        body: JSON.stringify({ emails: ['test@example.com'] }),
      })
      expect(toast.success).toHaveBeenCalledWith('Undangan berhasil dikirim!')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('adds current input when sending invite if valid', async () => {
    const mockRefresh = jest.fn()
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      message: 'Invites sent',
    })

    render(<ItineraryCard item={mockItem} refresh={mockRefresh} />)

    // Open invite dialog
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Invite'))

    // Type email without pressing Enter
    const input = screen.getByPlaceholderText('Email (pisahkan dengan spasi)')
    fireEvent.change(input, { target: { value: 'test@example.com' } })

    // Submit the form
    fireEvent.click(screen.getByText('Kirim'))

    await waitFor(() => {
      expect(customFetch).toHaveBeenCalledWith('/itineraries/1/invite/', {
        method: 'POST',
        body: JSON.stringify({ emails: ['test@example.com'] }),
      })
    })
  })

  it('shows error when invite form is submitted without emails', () => {
    render(<ItineraryCard item={mockItem} refresh={jest.fn()} />)

    // Open invite dialog
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Invite'))

    // Submit the form without adding any emails
    fireEvent.click(screen.getByText('Kirim'))

    expect(toast.error).toHaveBeenCalledWith('Email tidak boleh kosong')
    expect(customFetch).not.toHaveBeenCalled()
  })

  it('shows error toast when invite API fails', async () => {
    ;(customFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to send invites')
    )

    render(<ItineraryCard item={mockItem} refresh={jest.fn()} />)

    // Open invite dialog
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Invite'))

    // Add an email and submit
    const input = screen.getByPlaceholderText('Email (pisahkan dengan spasi)')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.click(screen.getByText('Kirim'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to send invites')
    })
  })

  it('removes a user from the itinerary successfully', async () => {
    const mockRefresh = jest.fn()
    ;(customFetch as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      message: 'User removed',
    })

    render(<ItineraryCard item={mockItem} refresh={mockRefresh} />)

    // Open invite dialog to access user list
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Invite'))

    // Find and click remove button for the user
    const removeButtons = screen.getAllByTestId('x-icon')
    // Find all divs that contain the user's name
    const userContainers = Array.from(document.querySelectorAll('div')).filter(
      (div) => div.textContent?.includes('John Doe')
    )

    // Get the container that has both the user name and an x-icon
    const userContainer = userContainers.find((container) =>
      container.querySelector('[data-testid="x-icon"]')
    )

    if (!userContainer) {
      throw new Error('Could not find remove button for John Doe')
    }

    const userRemoveButton = userContainer.querySelector(
      '[data-testid="x-icon"]'
    )
    fireEvent.click(userRemoveButton!)

    await waitFor(() => {
      expect(customFetch).toHaveBeenCalledWith('/itineraries/1/u1/remove', {
        method: 'DELETE',
      })
      expect(toast.success).toHaveBeenCalledWith('User berhasil dihapus!')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('shows error toast when user removal fails', async () => {
    ;(customFetch as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to remove user')
    )

    render(<ItineraryCard item={mockItem} refresh={jest.fn()} />)

    // Open invite dialog to access user list
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Invite'))

    // Find all divs that contain the user's name
    const userContainers = Array.from(document.querySelectorAll('div')).filter(
      (div) => div.textContent?.includes('John Doe')
    )

    // Get the container that has both the user name and an x-icon
    const userContainer = userContainers.find((container) =>
      container.querySelector('[data-testid="x-icon"]')
    )

    if (!userContainer) {
      throw new Error('Could not find remove button for John Doe')
    }

    const userRemoveButton = userContainer.querySelector(
      '[data-testid="x-icon"]'
    )
    fireEvent.click(userRemoveButton!)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to remove user')
    })
  })

  it('renders completed itinerary without mark as completed option', () => {
    const completedItem = { ...mockItem, isCompleted: true }
    render(<ItineraryCard item={completedItem} refresh={jest.fn()} />)

    // Open dropdown
    fireEvent.click(screen.getByTestId('option-btn'))

    // Check that "Mark as Completed" is not present
    expect(screen.queryByText('Mark as Completed')).not.toBeInTheDocument()
  })

  it('stops event propagation when clicking dialog content', () => {
    render(<ItineraryCard item={mockItem} refresh={jest.fn()} />)

    // Open invite dialog
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Invite'))

    // Click on dialog content
    fireEvent.click(screen.getByTestId('dialog-content'))

    // Router push should not be called
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('shows empty state for invited users when none exist', () => {
    const noUsersItem = { ...mockItem, invitedUsers: [] }
    render(<ItineraryCard item={noUsersItem} refresh={jest.fn()} />)

    // Open invite dialog
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Invite'))

    expect(
      screen.getByText('Belum ada akun yang terdaftar')
    ).toBeInTheDocument()
  })

  it('shows empty state for pending invites when none exist', () => {
    const noPendingItem = { ...mockItem, pendingInvites: [] }
    render(<ItineraryCard item={noPendingItem} refresh={jest.fn()} />)

    // Open invite dialog
    fireEvent.click(screen.getByTestId('option-btn'))
    fireEvent.click(screen.getByText('Invite'))

    expect(
      screen.getByText('Tidak ada undangan yang tertunda')
    ).toBeInTheDocument()
  })
})
