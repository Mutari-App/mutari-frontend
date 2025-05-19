import React, { type ReactNode } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProfileHeader } from '../src/modules/ProfileModule/sections/ProfileHeader'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { customFetch } from '@/utils/newCustomFetch'
import { toast } from 'sonner'
import '@testing-library/jest-dom'
import {
  type ChangeEmailFormProps,
  type EditProfileFormProps,
  type FormProps,
  type SubmitOtpFormProps,
} from '@/modules/ProfileModule/interface'

// Mock dependencies
jest.mock('@/contexts/AuthContext')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
jest.mock('@/utils/newCustomFetch', () => ({
  customFetch: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  customFetchBody: jest.fn((body) => body),
}))
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
jest.mock('next-cloudinary', () => ({
  CldUploadButton: ({
    children,
    onSuccess,
  }: {
    children: ReactNode
    onSuccess: (result: { event: string; info: { secure_url: string } }) => void
  }) => (
    <button
      data-testid="upload-button"
      onClick={() =>
        onSuccess({
          event: 'success',
          info: { secure_url: 'https://example.com/photo.jpg' },
        })
      }
    >
      {children}
    </button>
  ),
}))
jest.mock('@/icons/MutariPoint', () => ({
  MutariPoint: () => <div data-testid="mutari-point" />,
}))
jest.mock(
  '../src/modules/ProfileModule/module-elements/EditProfileForm',
  () => ({
    EditProfileForm: ({
      closeDialog,
      changeEmailButtonHandler,
    }: EditProfileFormProps) => (
      <div data-testid="edit-profile-form">
        <button data-testid="close-edit-profile" onClick={closeDialog}>
          Close
        </button>
        <button
          data-testid="change-email-button"
          onClick={changeEmailButtonHandler}
        >
          Change Email
        </button>
      </div>
    ),
  })
)
jest.mock(
  '../src/modules/ProfileModule/module-elements/ChangeEmailForm',
  () => ({
    ChangeEmailForm: ({
      closeDialog,
      setNewEmail,
      enableSubmitOtpMode,
      editProfileButtonHandler,
    }: ChangeEmailFormProps) => (
      <div data-testid="change-email-form">
        <button data-testid="close-change-email" onClick={closeDialog}>
          Close
        </button>
        <button
          data-testid="submit-otp-button"
          onClick={() => {
            setNewEmail('new@example.com')
            enableSubmitOtpMode()
          }}
        >
          Submit OTP
        </button>
        <button
          data-testid="back-to-edit-profile"
          onClick={editProfileButtonHandler}
        >
          Back
        </button>
      </div>
    ),
  })
)
jest.mock('../src/modules/ProfileModule/module-elements/SubmitOtpForm', () => ({
  SubmitOtpForm: ({
    newEmail,
    closeDialog,
    backButtonHandler,
  }: SubmitOtpFormProps) => (
    <div data-testid="submit-otp-form">
      <span data-testid="new-email">{newEmail}</span>
      <button data-testid="close-submit-otp" onClick={closeDialog}>
        Close
      </button>
      <button data-testid="back-to-change-email" onClick={backButtonHandler}>
        Back
      </button>
    </div>
  ),
}))
jest.mock(
  '../src/modules/ProfileModule/module-elements/ChangePasswordForm',
  () => ({
    ChangePasswordForm: ({ closeDialog }: FormProps) => (
      <div data-testid="change-password-form">
        <button data-testid="close-password-form" onClick={closeDialog}>
          Close
        </button>
      </div>
    ),
  })
)
jest.mock('lucide-react', () => ({
  UserIcon: () => <div data-testid="user-icon" />,
}))

// Mock Dialog components
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: ReactNode; open?: boolean }) =>
    open !== false ? <div>{children}</div> : null,
  DialogContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogFooter: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  DialogClose: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

// Sample profile props
const mockProfileProps = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  photoProfile: 'https://example.com/photo.jpg',
  loyaltyPoints: 100,
  totalItineraries: 5,
  totalLikes: 10,
  totalReferrals: 3,
  referralCode: 'ABCD1234',
}

describe('ProfileHeader', () => {
  const mockRefresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockRefresh.mockClear()
    ;(useRouter as jest.Mock).mockReturnValue({
      refresh: mockRefresh,
    })
  })

  test('renders profile information correctly', () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
    })

    render(<ProfileHeader {...mockProfileProps} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(
      screen.getByAltText("John Doe's profile picture")
    ).toBeInTheDocument()
  })

  test('hides edit buttons when user is not authenticated', () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
    })

    render(<ProfileHeader {...mockProfileProps} />)

    expect(screen.queryByText('Ubah Profil')).not.toBeInTheDocument()
    expect(screen.queryByText('Ubah Kata Sandi')).not.toBeInTheDocument()
  })

  test('shows edit buttons when authenticated as the profile owner', () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1' },
    })

    render(<ProfileHeader {...mockProfileProps} />)

    expect(
      screen.getByRole('button', { name: 'Ubah Profil' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Ubah Kata Sandi' })
    ).toBeInTheDocument()
  })

  test('opens edit profile dialog when clicking edit profile button', async () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1' },
    })

    render(<ProfileHeader {...mockProfileProps} />)

    fireEvent.click(screen.getByText('Ubah Profil'))

    expect(screen.getByText('Edit Profile')).toBeInTheDocument()
    expect(screen.getByTestId('edit-profile-form')).toBeInTheDocument()
  })

  test('opens password change dialog when clicking change password button', async () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1' },
    })

    render(<ProfileHeader {...mockProfileProps} />)

    fireEvent.click(screen.getByRole('button', { name: 'Ubah Kata Sandi' }))

    expect(screen.getByTestId('change-password-form')).toBeInTheDocument()
  })

  test('navigates to change email form and back', async () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1' },
    })

    render(<ProfileHeader {...mockProfileProps} />)

    fireEvent.click(screen.getByText('Ubah Profil'))
    fireEvent.click(screen.getByTestId('change-email-button'))

    expect(screen.getByTestId('change-email-form')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('back-to-edit-profile'))
    expect(screen.getByTestId('edit-profile-form')).toBeInTheDocument()
  })

  test('navigates to submit OTP form and back', async () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1' },
    })

    render(<ProfileHeader {...mockProfileProps} />)

    fireEvent.click(screen.getByText('Ubah Profil'))
    fireEvent.click(screen.getByTestId('change-email-button'))
    fireEvent.click(screen.getByTestId('submit-otp-button'))

    expect(screen.getByTestId('submit-otp-form')).toBeInTheDocument()
    expect(screen.getByTestId('new-email')).toHaveTextContent('new@example.com')

    fireEvent.click(screen.getByTestId('back-to-change-email'))
    expect(screen.getByTestId('change-email-form')).toBeInTheDocument()
  })

  test('closes dialogs when clicking close buttons', async () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1' },
    })

    render(<ProfileHeader {...mockProfileProps} />)

    // Test edit profile dialog
    fireEvent.click(screen.getByText('Ubah Profil'))
    expect(screen.getByTestId('edit-profile-form')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('close-edit-profile'))
    expect(screen.queryByTestId('edit-profile-form')).not.toBeInTheDocument()

    // Test password change dialog
    fireEvent.click(screen.getByText('Ubah Kata Sandi'))
    expect(screen.getByTestId('change-password-form')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('close-password-form'))
    expect(screen.queryByTestId('change-password-form')).not.toBeInTheDocument()
  })

  test('handles photo profile upload error', async () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      user: { id: '1' },
    })
    ;(customFetch as jest.Mock).mockResolvedValue({
      statusCode: 400,
      message: 'Error',
    })

    render(<ProfileHeader {...mockProfileProps} />)

    fireEvent.click(screen.getByTestId('upload-button'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Gagal memperbarui foto profil')
    })
  })

  test('displays values for stats when they are provided', () => {
    ;(useAuthContext as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      user: null,
    })

    render(
      <ProfileHeader
        {...mockProfileProps}
        totalItineraries={1}
        totalLikes={1}
        totalReferrals={1}
      />
    )

    expect(screen.getAllByText('1').length).toBeGreaterThan(0)
  })
})
