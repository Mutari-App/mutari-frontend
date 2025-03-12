import { Separator } from '@/components/ui/separator'
import { Instagram } from '@/icons/Instagram'
import { Twitter } from '@/icons/Twitter'
import { Mail } from 'lucide-react'

export const JoinUsSection = () => {
  return (
    <section className="hidden lg:flex flex-col min-w-[50%] text-white min-h-screen items-center justify-end px-[5%] py-[3%] gap-12 w-[50%]">
      <div className="text-center space-y-5">
        <h1 className="text-3xl font-semibold">Bergabung Bersama Kami!</h1>
        <p>
          Mutari hadir sebagai solusi terbaik untuk membuat pengalaman wisata
          Anda lebih mudah dan menyenangkan! Bersama Mutari, rencanakan liburan
          impian Anda ke Indonesia dengan lebih praktis dan tanpa ribet!
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-row gap-10 items-center justify-center">
          <Separator className="w-[25%]" />
          <p className="text-nowrap">Ikuti Kami</p>
          <Separator className="w-[25%]" />
        </div>

        <p>Tetap terhubung dan dapatkan informasi terbaru</p>

        <div className="flex flex-row gap-5 justify-center">
          <a
            href="https://instagram.com/mutari.id"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:underline transition-colors"
          >
            <Instagram className="w-4 h-4 md:w-6 md:h-6 drop-shadow-lg" />
          </a>
          <a
            href="https://x.com/mutariindonesia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:underline transition-colors"
          >
            <Twitter className="w-4 h-4 md:w-6 md:h-6 drop-shadow-lg" />
          </a>
          <a
            href="mailto:support@mutari.id"
            className="flex items-center space-x-2 hover:underline transition-colors"
          >
            <Mail className="w-4 h-4 md:w-6 md:h-6 drop-shadow-lg" />
          </a>
        </div>
      </div>
    </section>
  )
}
