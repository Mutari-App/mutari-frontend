'use client'

import { useEffect } from 'react'

// Definisi tipe untuk SDK DOKU Jokul yang benar
declare global {
  interface Window {
    loadJokulCheckout: (paymentToken: string) => void
    Jokul: {
      init: (config: {
        clientId: string
        url?: string
        isProduction?: boolean
      }) => void
      startPayment: (
        paymentId: string,
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

interface DokuScriptProps {
  clientId: string
  onLoad?: () => void
}

export const DokuScript: React.FC<DokuScriptProps> = ({ clientId, onLoad }) => {
  useEffect(() => {
    if (!clientId) {
      console.error('DOKU client ID is missing')
      return
    }

    // Check if the script is already loaded
    if (document.getElementById('jokul-js')) {
      // Initialize Jokul if it's already loaded
      if (window.Jokul) {
        window.Jokul.init({
          clientId: clientId,
          isProduction: process.env.NODE_ENV === 'production',
        })
        onLoad?.()
      }
      return
    }

    // Create and load the DOKU Jokul script (correct script path)
    const script = document.createElement('script')
    script.id = 'jokul-js'

    // Use correct URL based on environment
    const scriptUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://jokul.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.js'
        : 'https://sandbox.doku.com/jokul-checkout-js/v1/jokul-checkout-1.0.0.js'

    script.src = scriptUrl
    script.async = true

    script.onload = () => {
      console.log('DOKU Jokul script loaded')

      // Initialize Jokul SDK after loading
      if (window.Jokul) {
        window.Jokul.init({
          clientId: clientId,
          isProduction: process.env.NODE_ENV === 'production',
        })
        onLoad?.()
      }
    }

    script.onerror = () => {
      console.error('Failed to load DOKU Jokul script')
    }

    document.body.appendChild(script)

    // Cleanup function
    return () => {
      if (document.getElementById('jokul-js')) {
        document.body.removeChild(script)
      }
    }
  }, [clientId, onLoad])

  return null
}
