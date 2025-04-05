/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { calculateRoute, TransportMode } from '@/utils/maps'
import { toast } from 'sonner'

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}))

global.fetch = jest.fn()

describe('calculateRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock environment variable
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'
  })

  it('should successfully calculate a route for driving mode', async () => {
    // Mock successful response
    const mockResponse = {
      routes: [
        {
          distanceMeters: 5000,
          duration: '1200s',
          polyline: {
            encodedPolyline: 'encoded_polyline_string',
          },
        },
      ],
    }

    // Set up fetch mock
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    })

    const result = await calculateRoute('1.234,5.678', '2.345,6.789')

    // Check if fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      'https://routes.googleapis.com/directions/v2:computeRoutes',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': 'test-api-key',
        }),
        body: expect.stringContaining('"travelMode":"DRIVE"'),
      })
    )

    // Verify the request includes routingPreference for DRIVE mode
    const requestBody = JSON.parse(
      (global.fetch as jest.Mock).mock.calls[0][1].body
    )
    expect(requestBody.routingPreference).toBe('TRAFFIC_AWARE')

    // Verify the result
    expect(result).toEqual({
      distance: 5000,
      duration: 1200,
      polyline: 'encoded_polyline_string',
    })
  })

  it('should successfully calculate a route for walking mode without traffic awareness', async () => {
    // Mock successful response
    const mockResponse = {
      routes: [
        {
          distanceMeters: 2000,
          duration: '900s',
          polyline: {
            encodedPolyline: 'walking_polyline_string',
          },
        },
      ],
    }

    // Set up fetch mock
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    })

    const result = await calculateRoute(
      '1.234,5.678',
      '2.345,6.789',
      TransportMode.WALK
    )

    // Verify the request does NOT include routingPreference for WALK mode
    const requestBody = JSON.parse(
      (global.fetch as jest.Mock).mock.calls[0][1].body
    )
    expect(requestBody.routingPreference).toBeUndefined()

    // Verify the result
    expect(result).toEqual({
      distance: 2000,
      duration: 900,
      polyline: 'walking_polyline_string',
    })
  })

  it('should handle invalid origin coordinates', async () => {
    const result = await calculateRoute('invalid', '2.345,6.789')

    // Should show toast error
    expect(toast.error).toHaveBeenCalledWith(
      'Koordinat asal atau tujuan tidak valid'
    )

    // Should return null
    expect(result).toBeNull()

    // Fetch should not be called
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should handle invalid destination coordinates', async () => {
    const result = await calculateRoute('1.234,5.678', 'invalid')

    // Should show toast error
    expect(toast.error).toHaveBeenCalledWith(
      'Koordinat asal atau tujuan tidak valid'
    )

    // Should return null
    expect(result).toBeNull()

    // Fetch should not be called
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should handle API response errors', async () => {
    // Set up fetch mock with error response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
    })

    const result = await calculateRoute('1.234,5.678', '2.345,6.789')

    // Should show toast error
    expect(toast.error).toHaveBeenCalledWith(
      'Gagal menghitung rute: error 400',
      { id: 'route-calc' }
    )

    // Should return null
    expect(result).toBeNull()
  })

  it('should handle empty routes in response', async () => {
    // Mock response with no routes
    const mockResponse = {
      routes: [],
    }

    // Set up fetch mock
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    })

    const result = await calculateRoute(
      '1.234,5.678',
      '2.345,6.789',
      TransportMode.BICYCLE
    )

    // Should show toast error
    expect(toast.error).toHaveBeenCalledWith(
      'Rute tidak ditemukan untuk mode Sepeda',
      {
        id: 'route-calc',
      }
    )

    // Should return null
    expect(result).toBeNull()
  })

  it('should handle fetch exceptions', async () => {
    // Set up fetch mock to throw an error
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    )

    const result = await calculateRoute('1.234,5.678', '2.345,6.789')

    // Should show toast error
    expect(toast.error).toHaveBeenCalledWith('Gagal menghitung rute', {
      id: 'route-calc',
    })

    // Should return null
    expect(result).toBeNull()
  })

  it('should add traffic awareness for TWO_WHEELER mode', async () => {
    // Mock successful response
    const mockResponse = {
      routes: [
        {
          distanceMeters: 3000,
          duration: '600s',
          polyline: {
            encodedPolyline: 'two_wheeler_polyline',
          },
        },
      ],
    }

    // Set up fetch mock
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    })

    await calculateRoute(
      '1.234,5.678',
      '2.345,6.789',
      TransportMode.TWO_WHEELER
    )

    // Verify the request includes routingPreference for TWO_WHEELER mode
    const requestBody = JSON.parse(
      (global.fetch as jest.Mock).mock.calls[0][1].body
    )
    expect(requestBody.routingPreference).toBe('TRAFFIC_AWARE')
  })

  it('should handle missing distance in response', async () => {
    // Mock response with missing distanceMeters
    const mockResponse = {
      routes: [
        {
          duration: '600s',
          polyline: {
            encodedPolyline: 'test_polyline',
          },
        },
      ],
    }

    // Set up fetch mock
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    })

    const result = await calculateRoute('1.234,5.678', '2.345,6.789')

    // Should return with default distance of 0
    expect(result).toEqual({
      distance: 0,
      duration: 600,
      polyline: 'test_polyline',
    })
  })
})
