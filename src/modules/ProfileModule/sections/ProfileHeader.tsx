import { MutariPoint } from '@/icons/MutariPoint'
import { UserIcon } from 'lucide-react'
import Image from 'next/image'
import { ProfileProps } from '../interface'

export const ProfileHeader: React.FC<ProfileProps> = ({
  firstName,
  lastName,
  //   username,
  photoProfile,
  loyaltyPoints,
  totalItineraries,
  totalLikes,
  totalReferrals,
}) => {
  return (
    <header className="border-[3px] rounded-2xl border-[#9DBAEF] flex flex-col min-[500px]:flex-row p-6 gap-10">
      <div className="flex flex-col gap-3 w-full max-w-52 min-[500px]:max-w-28 mx-auto min-[500px]:mx-0">
        <div className="rounded-2xl bg-gray-200 overflow-hidden relative aspect-square w-full flex justify-center items-center">
          <UserIcon color="white" className="w-3/5 h-3/5 " />
          {photoProfile && (
            <Image
              src={photoProfile}
              alt={`${firstName} ${lastName}'s profile picture`}
              fill
              className="object-fill"
            />
          )}
        </div>
        {/* <Button
          className="w-full border-[#024C98] border-2 rounded-2xl text-[#024C98] font-semibold"
          variant={'outline'}
        >
          Pilih Foto
        </Button> */}
      </div>
      <div className="flex flex-col items-center min-[500px]:items-start gap-3">
        <span className="text-2xl font-semibold">
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
    </header>
  )
}
