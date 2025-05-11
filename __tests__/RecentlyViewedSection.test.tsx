import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { customFetch } from '@/utils/newCustomFetch'
import RecentlyViewedSection from '@/modules/TourMarketplaceModule/sections/RecentlyViewedSection'
import { type RecentlyViewedTourResponse } from '@/modules/TourMarketplaceModule/interface'

jest.mock('@/utils/newCustomFetch')

describe('RecentlyViewedSection', () => {
  it('should show empty message when data is empty', async () => {
    ;(customFetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({ tours: [] })
    })

    render(
      <RecentlyViewedSection
        title="Baru Dilihat"
        fetchEndpoint="/tour/views"
        mapData={(data: RecentlyViewedTourResponse) => data.tours}
        renderCard={(item) => <div key={item.id}>Card {item.id}</div>}
        emptyMessage="Tidak ada tour yang baru dilihat."
      />
    )

    await waitFor(() => {
      expect(
        screen.getByText('Tidak ada tour yang baru dilihat.')
      ).toBeInTheDocument()
    })
  })

    it('should handle fetch error gracefully', async () => {
    // Mock customFetch to throw an error
    ;(customFetch as jest.Mock).mockImplementation(() => {
      return Promise.reject(new Error('Failed to fetch'))
    })

    // Spy on console.error to suppress error logs in the test output
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {void 0 })

    render(
      <RecentlyViewedSection
        title="Baru Dilihat"
        fetchEndpoint="/tour/views"
        mapData={(data: RecentlyViewedTourResponse) => data.tours}
        renderCard={(item) => <div key={item.id}>Card {item.id}</div>}
        emptyMessage="Tidak ada tour yang baru dilihat."
      />
    )

    // Wait for the component to handle the error
    await waitFor(() => {
      expect(
        screen.getByText('Tidak ada tour yang baru dilihat.')
      ).toBeInTheDocument()
    })

    // Ensure the error was logged to the console
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching data from /tour/views:',
      expect.any(Error)
    )

    // Restore the original console.error
    consoleErrorSpy.mockRestore()
  })
})
