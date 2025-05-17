'use client'

import { useEffect } from 'react'
import { type MidtransScriptProps } from '../interface'

// Add window.snap type
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: any) => void
          onPending: (result: any) => void
          onError: (result: any) => void
          onClose: () => void
        }
      ) => void
    }
  }
}

export const MidtransScript: React.FC<MidtransScriptProps> = ({
  clientKey,
  onLoad,
}) => {
  useEffect(() => {
    if (!clientKey) {
      console.error('Midtrans client key is missing')
      return
    }

    // Check if the script is already loaded
    if (document.getElementById('midtrans-snap')) {
      onLoad?.()
      return
    }

    // Create and load the Midtrans Snap script
    const script = document.createElement('script')
    script.id = 'midtrans-snap'
    script.src = `https://app.sandbox.midtrans.com/snap/snap.js`
    script.setAttribute('data-client-key', clientKey)
    script.async = true

    script.onload = () => {
      console.log('Midtrans Snap script loaded')
      onLoad?.()
    }

    script.onerror = () => {
      console.error('Failed to load Midtrans Snap script')
    }

    document.body.appendChild(script)

    // Cleanup function
    return () => {
      if (document.getElementById('midtrans-snap')) {
        document.body.removeChild(script)
      }
    }
  }, [clientKey, onLoad])

  return null
}
