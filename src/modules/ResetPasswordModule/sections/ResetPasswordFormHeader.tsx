import { getImage } from '@/utils/getImage'
import Image from 'next/image'

export const ResetPasswordFormHeader = () => {
  return (
    <div className="flex flex-row items-center justify-center text-center gap-2">
      <Image
        src={getImage('logo-background-darkblue.png')}
        alt="Mutari Logo"
        width={150}
        height={50}
        className="h-12 w-auto z-30"
      />
      <span className="text-[#024C98] font-hammersmithOne text-[30px]">
        MUTARI
      </span>
    </div>
  )
}
