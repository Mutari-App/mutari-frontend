import React from 'react'
import { render, screen } from '@testing-library/react'
import ItineraryModule from '@/modules/ItineraryModule'

describe('ItineraryModule', () => {
  it('renders the ItineraryModule component', () => {
    render(<ItineraryModule />)

    // Check that the component renders with the correct text
    const moduleElement = screen.getByText('ItineraryModule')
    expect(moduleElement).toBeInTheDocument()
  })

  it('renders as a div element', () => {
    render(<ItineraryModule />)

    const moduleElement = screen.getByText('ItineraryModule')
    expect(moduleElement.tagName).toBe('DIV')
  })
})
