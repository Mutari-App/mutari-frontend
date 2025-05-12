import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProfileModule from '../src/modules/ProfileModule' // Adjust this path as needed
import { ProfileProps } from '../src/modules/ProfileModule/interface' // Import the interface
import React from 'react'

// Mock the imported components
jest.mock('../src/modules/ProfileModule/sections/ProfileHeader', () => ({
  ProfileHeader: (props: ProfileProps) => (
    <div data-testid="profile-header" data-props={JSON.stringify(props)}>
      Profile Header
    </div>
  ),
}))

jest.mock('../src/modules/ProfileModule/sections/ItinerariesSection', () => ({
  ItinerariesSection: ({ profile }: { profile: ProfileProps }) => (
    <div
      data-testid="itineraries-section"
      data-profile={JSON.stringify(profile)}
    >
      Itineraries Section
    </div>
  ),
}))

jest.mock(
  '../src/modules/ProfileModule/sections/LikedItinerariesSection',
  () => ({
    LikedItinerariesSection: ({ profile }: { profile: ProfileProps }) => (
      <div
        data-testid="liked-itineraries-section"
        data-profile={JSON.stringify(profile)}
      >
        Liked Itineraries Section
      </div>
    ),
  })
)

jest.mock('../src/modules/ProfileModule/sections/TransactionSection', () => ({
  TransactionSection: ({ profile }: { profile: ProfileProps }) => (
    <div
      data-testid="transaction-section"
      data-profile={JSON.stringify(profile)}
    >
      Transaction History Section
    </div>
  ),
}))

// Mock the UI components
jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({
    children,
    defaultValue,
  }: {
    children: React.ReactNode
    defaultValue: string
  }) => (
    <div data-testid="tabs" data-default-value={defaultValue}>
      {children}
    </div>
  ),
  TabsContent: ({
    children,
    value,
  }: {
    children: React.ReactNode
    value: string
  }) => <div data-testid={`tabs-content-${value}`}>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs-list">{children}</div>
  ),
  TabsTrigger: ({
    children,
    value,
  }: {
    children: React.ReactNode
    value: string
  }) => <button data-testid={`tab-${value}`}>{children}</button>,
}))

describe('ProfileModule', () => {
  const mockProfile: ProfileProps = {
    id: '1',
    photoProfile: 'https://example.com/avatar.jpg',
    firstName: 'Test',
    lastName: 'User',
    referralCode: 'TEST123',
    loyaltyPoints: 100,
    totalReferrals: 5,
    totalItineraries: 10,
    totalLikes: 20,
  }

  it('renders without crashing', () => {
    render(<ProfileModule profile={mockProfile} />)
    expect(screen.getByTestId('profile-header')).toBeInTheDocument()
  })

  it('renders with correct container classes', () => {
    const { container } = render(<ProfileModule profile={mockProfile} />)
    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveClass(
      'min-h-screen',
      'container',
      'mx-auto',
      'max-w-screen-xl'
    )
  })

  it('passes profile data to ProfileHeader correctly', () => {
    render(<ProfileModule profile={mockProfile} />)
    const header = screen.getByTestId('profile-header')
    expect(JSON.parse(header.dataset.props || '{}')).toEqual(mockProfile)
  })

  it('renders tabs with correct default value', () => {
    render(<ProfileModule profile={mockProfile} />)
    expect(screen.getByTestId('tabs')).toHaveAttribute(
      'data-default-value',
      'itineraries'
    )
  })

  it('renders both tab triggers with correct labels', () => {
    render(<ProfileModule profile={mockProfile} />)
    expect(screen.getByTestId('tab-itineraries')).toHaveTextContent(
      'Itineraries'
    )
    expect(screen.getByTestId('tab-likedItineraries')).toHaveTextContent(
      'Itinerary disukai'
    )
  })

  it('passes profile data to tab content sections correctly', () => {
    render(<ProfileModule profile={mockProfile} />)

    const itinerariesSection = screen.getByTestId('itineraries-section')
    expect(JSON.parse(itinerariesSection.dataset.profile || '{}')).toEqual(
      mockProfile
    )

    const likedSection = screen.getByTestId('liked-itineraries-section')
    expect(JSON.parse(likedSection.dataset.profile || '{}')).toEqual(
      mockProfile
    )
  })
})
