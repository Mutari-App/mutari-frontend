'use client'

import React, { useEffect } from 'react'
import { AcceptInvitationInteface, AcceptInviteModuleProps } from './interface'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuthContext } from '@/contexts/AuthContext'
import { customFetch } from '@/utils/newCustomFetch'

export const AcceptInviteModule: React.FC<AcceptInviteModuleProps> = ({
  itineraryId,
}) => {
  const { isAuthenticated } = useAuthContext()
  const router = useRouter()

  const getInvitation = async () => {
    if (!isAuthenticated) {
      toast.error('Silahkan login terlebih dahulu!')
      router.push(`/login?redirect=/itinerary/${itineraryId}/accept-invite`)
    } else {
      try {
        const acceptResponse = await customFetch<AcceptInvitationInteface>(
          `/itineraries/${itineraryId}/accept-invitation`,
          {
            method: 'POST',
          }
        )

        if (acceptResponse.statusCode !== 200) {
          throw new Error(acceptResponse.message)
        }
        router.push(`/itinerary/${itineraryId}`)
      } catch (err) {
        toast.error('Undangan tidak valid!', {
          description: 'Coba gunakan akun lain atau minta undangan baru',
        })
        router.push('/')
      }
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      void getInvitation()
    }, 0)

    return () => clearTimeout(timeout)
  }, [toast])

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin w-6 h-6 mr-2" />
    </div>
  )
}
