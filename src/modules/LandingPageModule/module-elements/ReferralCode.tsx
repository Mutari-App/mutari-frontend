import React from 'react'
import { type ReferralCodeProps } from '../interface'
import Image from 'next/image'
import { getImage } from '@/utils/getImage'
import { Button } from '@/components/ui/button'
import { Copy, Gift, Mail, Share2, Users } from 'lucide-react'
import { Twitter } from '@/icons/Twitter'
import { Instagram } from '@/icons/Instagram'
import { toast } from 'sonner'

export const ReferralCode: React.FC<ReferralCodeProps> = ({ user }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `Gunakan kode referral saya ${user?.referralCode} untuk bergabung di Mutari! 🚀\nDaftar di sini: ${process.env.CLIENT_URL ?? 'https://mutari.id'}`
      )

      toast.success('Berhasil menyalin kode!')
    } catch (err) {
      toast.error('Gagal menyalin kode!')
    }
  }
  return (
    <div className="relative flex flex-col gap-2 items-center text-center">
      <div className="relative w-40 aspect-[3] mb-2">
        <Image
          src={getImage('logo-with-name-white.png')}
          alt="Mutari Logo"
          fill
          className="object-contain"
        />
      </div>
      <span className="text-sm sm:text-base mb-4">
        Anda telah berhasil melakukan praregistrasi dengan email:{' '}
        <strong className="font-semibold">{user?.email}</strong>
      </span>
      <h1 className="font-bold text-xl md:text-2xl lg:text-3xl mb-3">
        Login Berhasil!
      </h1>
      <div className="bg-[#FBFFF1] text-black gap-2 flex flex-col rounded-xl px-16 py-2 sm:py-4 mb-2 font-raleway">
        <span className="font-semibold text-base sm:text-xl">
          Kode Referal Anda:
        </span>
        <div className="flex gap-2">
          <span className="font-bold tracking-[0.2em] text-xl sm:text-2xl md:text-3xl">
            {user?.referralCode}
          </span>
          <button onClick={handleCopy}>
            <Copy size={18} className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs mb-2">
        <Users size={20} />
        <span>
          <strong>{user?.usedCount} pengguna</strong> telah menggunakan kode
          referral anda
        </span>
      </div>
      <div className="border border-white flex flex-col gap-3 items-center py-5 px-2 md:p-5">
        <div className="flex items-start gap-1 sm:gap-2">
          <Gift className="w-5 h-5 sm:w-6 sm:h-6" />{' '}
          <span className="text-sm sm:text-lg md:text-xl">
            Bagikan dan Dapatkan Hadiah Menarik!
          </span>
        </div>
        <span className="text-xs sm:text-sm">
          Informasi terkait hadiah akan kami infokan lebih lanjut melalui web
          ini dan media sosial kami
        </span>
        <span className="text-xs text-[#B4C5E4]">
          *Penukaran poin dapat dilakukan setelah platform diluncurkan
        </span>
        <Button variant={'secondary'} onClick={handleCopy}>
          <Share2 />
          <span>Bagikan kode referal</span>
        </Button>
      </div>
      <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 items-center">
        <span className="font-semibold text-base sm:text-lg">Ikuti Kami</span>
        <span className="font-extralight text-xs sm:text-sm md:text-base">
          Tetap terhubung dan dapatkan informasi terbaru
        </span>
        <div className="flex gap-5">
          <a href="https://x.com/mutariindonesia" target="_blank">
            <Twitter size={24} />
          </a>
          <a href="https://www.instagram.com/mutari.id/" target="_blank">
            <Instagram size={24} />
          </a>
          <a href="mailto:support@mutari.id" target="_blank">
            <Mail size={25} />
          </a>
        </div>
      </div>
    </div>
  )
}
