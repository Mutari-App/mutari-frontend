import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/contexts/AuthContext'
import { Share2, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { customFetch } from '@/utils/newCustomFetch'
import { toast } from 'sonner'
import { DuplicateItineraryResponse } from '@/modules/ItineraryModule/module-elements/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Head from 'next/head'

export const ItineraryHeader = ({
  data,
  contingencyId,
  refresh,
}: {
  data: Itinerary
  contingencyId?: string
  refresh: () => Promise<void>
}) => {
  const { user } = useAuthContext()
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [emails, setEmails] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareLink(window.location.href)
    }
  }, [])

  const openInviteDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      const response = await customFetch(`/itineraries/${data.id}/invite/`, {
        method: 'POST',
        body: JSON.stringify({ emails: updatedEmails }),
      })

      if (response.statusCode !== 200) throw new Error(response.message)
      toast.success('Undangan berhasil dikirim!')
      setEmails([])
      setEmailInput('')
      await refresh()
    } catch (err) {
      if (err instanceof Error) toast.error(`${err.message}`)
    }
  }

  const removeUser = async (userId: string) => {
    try {
      setIsLoading(true)
      const response = await customFetch(
        `/itineraries/${data.id}/${userId}/remove`,
        {
          method: 'DELETE',
        }
      )

      if (response.statusCode === 404) {
        throw new Error('Pengguna tidak ditemukan')
      }

      if (response.statusCode !== 200) throw new Error(response.message)
      toast.success('User berhasil dihapus!')
      await refresh()
    } catch (err) {
      if (err instanceof Error) toast.error(`${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const duplicateItinerary = async () => {
    try {
      setIsLoading(true)
      const response = await customFetch<DuplicateItineraryResponse>(
        `/itineraries/${data.id}/duplicate`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )

      if (response.statusCode !== 201) throw new Error(response.message)
      toast.success('Itinerary duplicated successfully!')
    } catch (err) {
      if (err instanceof Error) toast.error(`${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const renderAcceptedUsers = () => {
    if (isLoading) {
      return <div className="text-center py-4">Memuat...</div>
    }

    if (data.invitedUsers?.length > 0) {
      return (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {data.invitedUsers?.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <div className="flex items-center gap-2">
                <div className="relative rounded-full overflow-hidden aspect-square w-10  ">
                  <Avatar>
                    <AvatarImage
                      src={user.photoProfile}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback>
                      {user.firstName.charAt(0)}
                      {user.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-gray-400 text-sm">{user.email}</span>
                </div>
              </div>
              <button onClick={() => removeUser(user.id)}>
                <X />
              </button>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="text-center py-4 text-gray-500">
        Belum ada akun yang terdaftar
      </div>
    )
  }

  const renderPendingInvites = () => {
    if (isLoading) {
      return <div className="text-center py-4">Memuat...</div>
    }

    if (data.pendingInvites?.length > 0) {
      return (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {data.pendingInvites.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{user.email}</span>
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="text-center py-4 text-gray-500">
        Tidak ada undangan yang tertunda
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-40 md:h-64 rounded-md mb-4 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: data.coverImage
          ? `url(${data.coverImage})`
          : 'linear-gradient(360deg, #004080, #0073E6, #60A5FA)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 z-10 p-2 sm:p-4">
        <div className="flex flex-col">
          <h1 className="text-lg md:text-4xl font-bold text-white">
            {data.title}
          </h1>
          {data.description && (
            <div className="flex flex-col gap-2">
              <p className="text-xs md:text-sm font-raleway text-white max-h-16 overflow-y-auto">
                <style jsx>{`
                  p::-webkit-scrollbar {
                    width: 4px;
                  }
                  p::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  p::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.3);
                    border-radius: 20px;
                  }
                `}</style>
                {data.description}
              </p>
              {user?.id !== data.userId && (
                <div>
                  <p className="text-[14px] md:text-s font-raleway text-white/80 italic">
                    {data.user.firstName} {data.user.lastName}
                  </p>
                  <p className="text-[10px] md:text-xs font-raleway text-white/80 italic">
                    {data._count.likes} orang menyukai itinerary ini
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {user?.id === data.userId && (
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="bg-white text-black rounded-xl shadow"
            onClick={openInviteDialog}
          >
            <Share2 className="w-6 h-6 text-[#004080]" />
          </Button>
          {user?.id === data.userId && (
            <Link
              href={contingencyId ? `${contingencyId}/edit` : `${data.id}/edit`}
            >
              <Button
                size="sm"
                type="button"
                variant="ghost"
                className="bg-white text-[#004080] rounded-xl shadow"
              >
                Edit
              </Button>
            </Link>
          )}
        </div>
      )}
      {user?.id !== data.userId && (
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex">
          <Button
            onClick={duplicateItinerary}
            size="sm"
            type="button"
            variant="ghost"
            className="bg-white text-[#004080] rounded-xl shadow"
          >
            Duplikasi dan Edit
          </Button>
        </div>
      )}

      <Dialog
        open={showModal || showInviteDialog}
        onOpenChange={(open) => {
          setShowModal(open)
          setShowInviteDialog(open)
        }}
      >
        {(showModal || showInviteDialog) && (
          <Head>
            <meta property="og:title" content={data.title} />
            <meta property="og:description" content={data.description || 'Lihat itinerary ini!'} />
            <meta property="og:image" content={data.coverImage || '/default-image.jpg'} />
          </Head>
        )}
        <DialogContent className="font-roboto cursor-default p-6 pb-10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center w-full font-semibold">
              Bagikan Itinerary
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="share" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="share">Share Link</TabsTrigger>
              <TabsTrigger value="invite">Undang via Email</TabsTrigger>
            </TabsList>

            <TabsContent value="share">
              <div className="text-sm text-center text-gray-600 mb-4">
                Copy dan kirim link dibawah ini. Orang yang mempunyai link dapat
                melihat, tetapi tidak bisa edit maupun duplikat
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-md p-2">
                <span className="text-sm text-gray-800 truncate w-[300px]">
                  {shareLink}
                </span>
                <Button
                  className="px-4 py-2 bg-gradient-to-r from-[#016CD7] to-[#014285] text-white items-center rounded"
                  onClick={() => {
                    void navigator.clipboard
                      .writeText(shareLink)
                      .then(() => {
                        toast.message('Link berhasil disalin')
                      })
                      .catch((error) => {
                        toast.error('Gagal menyalin link')
                        console.error('Clipboard error:', error)
                      })
                  }}
                >
                  Salin
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="invite">
              <DialogDescription className="text-gray-500 text-center max-w-xs mx-auto mb-4">
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
                    Akun Terdaftar ({data.invitedUsers?.length})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({data.pendingInvites?.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="accepted" className="mt-4">
                  {renderAcceptedUsers()}
                </TabsContent>

                <TabsContent value="pending" className="mt-4">
                  {renderPendingInvites()}
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
