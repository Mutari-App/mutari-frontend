// ItineraryCardSkeleton.test.jsx
import React from 'react'
import { render } from '@testing-library/react'
import ItineraryCardSkeleton from '@/modules/HomePageModule/module-elements/ItineraryCardSkeleton'

describe('ItineraryCardSkeleton', () => {
  it('renders the skeleton card with placeholders', () => {
    const { container } = render(<ItineraryCardSkeleton />)

    // cek container utama
    const card = container.querySelector('div.flex.flex-col.w-1\\/5')
    expect(card).toBeInTheDocument()

    // cek skeleton image
    const imageSkeleton = container.querySelector('.h-24, .sm\\:h-40')
    expect(imageSkeleton).toBeInTheDocument()

    // cek beberapa bar skeleton
    const bars = container.querySelectorAll('.bg-gray-200')
    expect(bars.length).toBeGreaterThanOrEqual(4) // termasuk image dan 3 baris teks

    // pastikan semua elemen skeleton punya class animate-pulse
    bars.forEach((bar) => {
      expect(bar).toHaveClass('animate-pulse')
    })
  })
})
