'use client'

import type React from 'react'

import { MutariPoint } from '@/icons/MutariPoint'
import { UserIcon } from 'lucide-react'
import Image from 'next/image'
import type { ProfileProps } from '../interface'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { EditProfileForm } from '../module-elements/EditProfileForm'
import { ChangeEmailForm } from '../module-elements/ChangeEmailForm'
import { SubmitOtpForm } from '../module-elements/SubmitOtpForm'
import { ChangePasswordForm } from '../module-elements/ChangePasswordForm'
import {
  CldUploadButton,
  CloudinaryUploadWidgetInfo,
  CloudinaryUploadWidgetResults,
} from 'next-cloudinary'
import { cn } from '@/lib/utils'
import { customFetch, customFetchBody } from '@/utils/newCustomFetch'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export const ProfileHeader: React.FC<ProfileProps> = ({
  id,
  firstName,
  lastName,
  //   username,
  photoProfile,
  loyaltyPoints,
  totalItineraries,
  totalLikes,
  totalReferrals,
}) => {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthContext()

  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState<boolean>(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] =
    useState<boolean>(false)
  const [formStep, setFormStep] = useState<
    'EDIT_PROFILE' | 'CHANGE_EMAIL' | 'SUBMIT_OTP'
  >('EDIT_PROFILE')
  const [newEmail, setNewEmail] = useState<string>('')

  const closePasswordDialog = () => {
    setIsPasswordDialogOpen(false)
  }

  const closeDialog = () => {
    setIsProfileDialogOpen(false)
    setFormStep('EDIT_PROFILE')
  }

  const enableEditProfileMode = () => {
    setFormStep('EDIT_PROFILE')
  }

  const enableChangeEmailMode = () => {
    setFormStep('CHANGE_EMAIL')
  }

  const enableSubmitOtpMode = () => {
    setFormStep('SUBMIT_OTP')
  }

  const onPhotoProfileChange = async (
    result: CloudinaryUploadWidgetResults
  ) => {
    if (result.event === 'success') {
      const secureUrl = (result.info as CloudinaryUploadWidgetInfo).secure_url
      try {
        const response = await customFetch(`/profile/photo-profile`, {
          method: 'PATCH',
          body: customFetchBody({ photoProfileUrl: secureUrl }),
        })

        if (response.statusCode === 200) {
          toast.success('Foto profil berhasil diperbarui')
          router.refresh()
          return
        }
        throw new Error(response.message)
      } catch (error) {
        toast.error('Gagal memperbarui foto profil')
      }
    }
  }

  return (
    <header className="border-[3px] rounded-2xl border-[#9DBAEF] flex flex-col sm:flex-row p-6 gap-10">
      <div className="flex flex-col gap-3 w-full max-w-52 sm:max-w-28 mx-auto sm:mx-0">
        <div className="rounded-2xl bg-gray-200 overflow-hidden relative aspect-square w-full flex justify-center items-center">
          <UserIcon color="white" className="w-3/5 h-3/5 " />
          {photoProfile && (
            <Image
              src={photoProfile || '/placeholder.svg'}
              alt={`${firstName} ${lastName}'s profile picture`}
              fill
              className="object-fill"
            />
          )}
        </div>
        {isAuthenticated && user?.id === id && (
          <CldUploadButton
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={onPhotoProfileChange}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'w-full border-[#024C98] border-2 rounded-2xl text-[#024C98] font-semibold'
            )}
            options={{
              clientAllowedFormats: ['image'],
              maxFiles: 1,
              maxFileSize: 1024 * 256, // 256 KB
            }}
          >
            Pilih Foto
          </CldUploadButton>
        )}
      </div>
      <div className="flex flex-col items-center sm:items-start gap-3 w-full">
        <span className="text-2xl text-center sm:text-start font-semibold">
          {firstName} {lastName}
        </span>
        {/* <span>@{username}</span> */}
        <div className="flex gap-1">
          <MutariPoint />
          <span className="font-semibold">{loyaltyPoints}</span>
        </div>
        <div className="flex gap-7">
          <div className="flex flex-col items-center">
            <span className="font-semibold text-xl">
              {totalItineraries || 0}
            </span>
            <span>Itinerary</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-xl">{totalLikes || 0}</span>
            <span>Suka</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-xl">{totalReferrals || 0}</span>
            <span>Referral</span>
          </div>
        </div>
      </div>
      {isAuthenticated && user?.id === id && (
        <div className="flex flex-col min-[500px]:flex-row sm:flex-col gap-3 w-full sm:w-fit min-[500px]:max-w-none max-w-52 mx-auto">
          <Button
            className="w-full border-[#024C98] border-2 rounded-2xl text-[#024C98] font-semibold"
            variant={'outline'}
            onClick={() => setIsProfileDialogOpen(true)}
          >
            Ubah Profil
          </Button>

          <Dialog
            open={isProfileDialogOpen}
            onOpenChange={(open) => {
              setIsProfileDialogOpen(open)
              if (!open) {
                setFormStep('EDIT_PROFILE')
              }
            }}
          >
            <DialogContent className="sm:max-w-[425px] md:p-8 rounded-2xl sm:rounded-3xl  ">
              <DialogHeader>
                <DialogTitle className="px-1">Edit Profile</DialogTitle>
              </DialogHeader>
              <div
                className={`flex flex-col gap-5 md:gap-4 overflow-hidden px-1 relative transition-all ${formStep === 'EDIT_PROFILE' ? 'h-[27rem]' : 'h-[12rem]'} `}
              >
                {/* Edit Profile form */}
                <div
                  className={`transition-all   duration-500 ease-in-out  w-full ${formStep === 'EDIT_PROFILE' ? 'transform translate-x-0 opacity-100' : 'transform -translate-x-full h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="font-medium space-y-5 ">
                    <EditProfileForm
                      closeDialog={closeDialog}
                      changeEmailButtonHandler={enableChangeEmailMode}
                    />
                  </div>
                </div>

                {/* Email change form */}
                <div
                  className={`transition-transform duration-500 ease-in-out  w-full ${formStep === 'CHANGE_EMAIL' ? 'transform translate-x-0 opacity-100 -mt-4' : 'transform translate-x-full h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="font-medium space-y-2">
                    <ChangeEmailForm
                      closeDialog={closeDialog}
                      setNewEmail={setNewEmail}
                      enableSubmitOtpMode={enableSubmitOtpMode}
                      editProfileButtonHandler={enableEditProfileMode}
                    />
                  </div>
                </div>

                {/* Submit OTP form */}
                <div
                  className={`transition-transform duration-500 ease-in-out  w-full ${formStep === 'SUBMIT_OTP' ? 'transform translate-x-0 opacity-100 -mt-8' : 'transform translate-x-full h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="font-medium space-y-2">
                    <SubmitOtpForm
                      newEmail={newEmail}
                      closeDialog={closeDialog}
                      backButtonHandler={enableChangeEmailMode}
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Password Change Button */}
          <Button
            className="w-full border-[#024C98] border-2 rounded-2xl text-[#024C98] font-semibold"
            variant={'outline'}
            onClick={() => setIsPasswordDialogOpen(true)}
          >
            Ubah Kata Sandi
          </Button>

          {/* Password Change Dialog */}
          <Dialog
            open={isPasswordDialogOpen}
            onOpenChange={setIsPasswordDialogOpen}
          >
            <DialogContent className="sm:max-w-[425px] md:p-8 rounded-2xl sm:rounded-3xl">
              <DialogHeader>
                <DialogTitle className="px-1">Ubah Kata Sandi</DialogTitle>
              </DialogHeader>
              <div className="px-1">
                <ChangePasswordForm closeDialog={closePasswordDialog} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </header>
  )
}
