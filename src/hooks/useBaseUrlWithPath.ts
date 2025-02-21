import { usePathname } from 'next/navigation'
import { useState, useLayoutEffect } from 'react'

export const useBaseUrlWithPath = () => {
  const [url, setUrl] = useState('')
  const pathname = usePathname()

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      // Construct URL using window.location properties and the pathname from Next.js router
      let baseUrlWithPath = `${window.location.protocol}//${window.location.host}${pathname}`

      // Remove trailing slash if it exists
      baseUrlWithPath = baseUrlWithPath.replace(/\/$/, '')

      setUrl(baseUrlWithPath)
    }
  }, [pathname])

  return url
}
