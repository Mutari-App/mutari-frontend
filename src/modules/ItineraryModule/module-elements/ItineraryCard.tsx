'use client'

import { getImage } from '@/utils/getImage'
import { MoreHorizontal, X } from 'lucide-react'
import Image from 'next/image'
import type React from 'react'
import { useRef, useState, type KeyboardEvent } from 'react'
import type { DuplicateItineraryResponse, ItineraryData } from './types'
import useOutsideClick from '@/hooks/useOutsideClick'
import { customFetch } from '@/utils/newCustomFetch'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthContext } from '@/contexts/AuthContext'

function ItineraryCard({
  item,
  refresh,
}: {
  readonly item: Readonly<ItineraryData>
  readonly refresh: () => void
}) {
  const { user } = useAuthContext()
  const [openOptions, setOpenOptions] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [emails, setEmails] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const optionRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const daysTotal = Math.floor(
    (new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  ) + 1

  useOutsideClick({
    ref: optionRef,
    handler: () => setOpenOptions(false),
  })

  const openDeleteConfirmation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setOpenOptions(false)
    setShowDeleteDialog(true)
  }

  const openInviteDialog = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setShowInviteDialog(true)
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmailInput(value)

    // If the user enters a space, add the email to the list
    if (value.endsWith(' ')) {
      addEmail(value.trim())
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && emailInput.trim()) {
      e.preventDefault()
      addEmail(emailInput.trim())
    } else if (
      e.key === 'Backspace' &&
      emailInput === '' &&
      emails.length > 0
    ) {
      // Remove the last email when backspace is pressed on empty input
      const newEmails = [...emails]
      newEmails.pop()
      setEmails(newEmails)
    }
  }

  const addEmail = (email: string) => {
    if (email && isValidEmail(email) && !emails.includes(email)) {
      setEmails([...emails, email])
      setEmailInput('')
    } else if (email && !isValidEmail(email)) {
      setEmailInput('')
      toast.error('Email tidak valid')
    }
  }

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove))
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()

    // Add the current input if it's not empty and valid
    let updatedEmails = emails
    if (emailInput.trim() && isValidEmail(emailInput.trim())) {
      updatedEmails = [...emails, emailInput.trim()]
      setEmails(updatedEmails)
      setEmailInput('')
    }

    if (updatedEmails.length === 0) {
      toast.error('Email tidak boleh kosong')
      return
    }

    try {
      const response = await customFetch(`/itineraries/${item.id}/invite/`, {
        method: 'POST',
        body: JSON.stringify({ emails: updatedEmails }),
      })

      if (response.statusCode !== 200) throw new Error(response.message)
      toast.success('Undangan berhasil dikirim!')
      setEmails([])
      setEmailInput('')
      refresh()
    } catch (err) {
      if (err instanceof Error) toast.error(`${err.message}`)
    }
  }

  const markAsComplete = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    try {
      const response = await customFetch(
        `/itineraries/${item.id}/mark-as-complete/`,
        {
          method: 'PATCH',
        }
      )

      if (response.statusCode !== 200) throw new Error(response.message)
      toast.success('Itinerary marked as complete!')
      refresh()
    } catch (err) {
      if (err instanceof Error) toast.error(`${err.message}`)
    }
  }

  const removeItinerary = async () => {
    try {
      const response = await customFetch(`/itineraries/${item.id}/`, {
        method: 'DELETE',
      })

      if (response.statusCode !== 200) throw new Error(response.message)
      toast.success('Itinerary deleted successfully!')
      setShowDeleteDialog(false)
      refresh()
    } catch (err) {
      if (err instanceof Error) toast.error(`${err.message}`)
    }
  }

  const removeUser = async (userId: string) => {
    try {
      setIsLoading(true)
      const response = await customFetch(
        `/itineraries/${item.id}/${userId}/remove`,
        {
          method: 'DELETE',
        }
      )

      if (response.statusCode === 404) {
        refresh()
        throw new Error('Pengguna tidak ditemukan')
      }

      if (response.statusCode !== 200) throw new Error(response.message)
      toast.success('User berhasil dihapus!')
      refresh()
    } catch (err) {
      if (err instanceof Error) toast.error(`${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const duplicateItinerary = async () => {
    try {
      const response = await customFetch<DuplicateItineraryResponse>(
        `/itineraries/${item.id}/duplicate`,
        {
          method: 'POST',
        }
      )

      if (response.statusCode !== 201) throw new Error(response.message)
      else router.push(`/itinerary/${response.duplicatedItinerary.id}/edit`)
      toast.success('Itinerary duplicated successfully!')
    } catch (err) {
      if (err instanceof Error) toast.error(`${err.message}`)
    }
  }

  return (
    <div
      onClick={() => router.push(`/itinerary/${item.id}`)}
      className="group flex items-center gap-5 shadow-lg w-full rounded-xl overflow-hidden hover:cursor-pointer relative"
    >
      <div className="w-1/4 h-full overflow-hidden">
        <Image
          src={
            item.coverImage !== '' && item.coverImage != null
              ? item.coverImage
              : getImage('logo-no-background.png')
          }
          alt={item.title}
          width={720}
          height={720}
          className="w-full h-full object-cover pointer-events-none group-hover:scale-125 duration-300"
        />
      </div>
      <div className="w-3/4 h-full flex flex-col gap-2 py-4">
        <p className="font-raleway font-medium text-sm md:text-xl w-4/5">
          {item.title}
        </p>
        <div className="font-raleway text-[#94A3B8] flex flex-col gap-1">
          <p className="text-xs md:text-sm">
            {daysTotal} Hari • {item.locationCount} Destinasi
          </p>
        </div>
      </div>
      {user?.id === item.userId && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              data-testid="option-btn"
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-black/10"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={openInviteDialog}>
              Invite
            </DropdownMenuItem>
            {!item.isCompleted && (
              <DropdownMenuItem onClick={markAsComplete}>
                Mark as Completed
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={duplicateItinerary}>
              Duplicate & Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={openDeleteConfirmation}
              className="text-red-500 focus:text-red-500"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent
          className="font-roboto cursor-default p-6 pb-10 max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl text-center w-full font-semibold">
              Masukkan email
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-500 text-center max-w-xs mx-auto">
            Invite orang yang ingin kamu undang untuk melihat itinerary-mu!
          </DialogDescription>

          <form onSubmit={handleInvite} className="mb-6 flex w-full gap-2">
            <div className="flex flex-wrap items-center gap-2 p-2 w-full border rounded-md mb-2 min-h-10">
              {emails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                >
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeEmail(email)
                    }}
                    className="text-blue-800 hover:text-blue-900"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <input
                ref={inputRef}
                type="text"
                placeholder={
                  emails.length > 0 ? '' : 'Email (pisahkan dengan spasi)'
                }
                value={emailInput}
                onChange={handleEmailInputChange}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                className="w-full outline-none border-none min-w-[120px]"
              />
            </div>
            <div className="flex justify-end">
              <Button
                className="px-4 py-2 bg-gradient-to-r from-[#016CD7] to-[#014285] text-white items-center rounded"
                type="submit"
              >
                Kirim
              </Button>
            </div>
          </form>

          {/* Tabs for invited users */}
          <Tabs defaultValue="accepted" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="accepted">
                Akun Terdaftar ({item.invitedUsers?.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({item.pendingInvites?.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="accepted" className="mt-4">
              {isLoading ? (
                <div className="text-center py-4">Memuat...</div>
              ) : item.invitedUsers?.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {item.invitedUsers?.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative rounded-full overflow-hidden aspect-square w-10  ">
                          <Image
                            src={
                              user.photoProfile ||
                              '/images/profile-placeholder.png'
                            }
                            alt={`${user.firstName} ${user.lastName}`}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => removeUser(user.id)}>
                        <X />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Belum ada akun yang terdaftar
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              {isLoading ? (
                <div className="text-center py-4">Memuat...</div>
              ) : item.pendingInvites?.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {item.pendingInvites.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <div className="rounded-full aspect-square w-10 bg-gray-400 text-white text-2xl text-center leading-10">
                          {user.email[0].toUpperCase()}
                        </div>
                        <span>{user.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Tidak ada undangan yang tertunda
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent
          className="font-roboto p-8 rounded-lg max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogTitle className="text-xl font-semibold text-center">
            Apakah anda yakin?
          </DialogTitle>
          <DialogDescription className="text-md text-center">
            Anda ingin menghapus itinerary ini?
          </DialogDescription>
          <DialogFooter className="flex w-full sm:justify-center justify-center gap-y-2">
            <Button
              className="px-8 py-2 border-2 border-[#016CD7] bg-white rounded text-[#014285]"
              onClick={() => setShowDeleteDialog(false)}
            >
              Batal
            </Button>
            <Button
              className="px-8 py-2 bg-gradient-to-r from-[#016CD7] to-[#014285] text-white items-center rounded"
              onClick={removeItinerary}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ItineraryCard
