'use client'

import React, { useEffect } from 'react'
import { AcceptInvitationInteface, AcceptInviteModuleProps } from './interface'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { customFetch } from '@/utils/newCustomFetch'

export const AcceptInviteModule: React.FC<AcceptInviteModuleProps> = ({
  itineraryId,
}) => {
  const router = useRouter()

  const getInvitaion = async () => {
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

  useEffect(() => {
    void getInvitaion()
  }, [])
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin w-6 h-6 mr-2" />
    </div>
  )
}
