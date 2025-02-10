import { getImage } from '@/utils/getImage'
import { type FeatureCardProps } from '../interface'
import Image from 'next/image'

const FeatureCard: React.FC<FeatureCardProps> = (feature) => {
  return (
    <div className="shadow-[0px_3.25px_12px_rgba(1,95,189,1)] relative w-full min-h-60 text-white bg-gradient-to-br from-white/40 from-[10%] to-white/5 rounded-3xl overflow-hidden flex flex-col items-center md:items-start justify-start md:justify-center pt-[50%] md:pt-[35%] pb-[10%] px-[10%] lg:pl-[40%] xl:pl-[35%] lg:pr-[10%] lg:py-5 space-y-2 ">
      <div className="absolute rounded-full -top-[90px] md:-top-[90px] -left-[100px] md:-left-[100px] w-[230px] md:w-[250px] lg:w-[350px] h-[230px] md:h-[250px] lg:h-[350px] outline outline-2 outline-white/10"></div>
      <div className="absolute rounded-full -top-[75px] md:-top-[75px] -left-[75px] md:-left-[75px] w-[180px] md:w-[200px] lg:w-[275px] h-[180px] md:h-[200px] lg:h-[275px] outline outline-2 outline-white/10"></div>
      <div className="absolute rounded-full -top-[50px] md:-top-[50px] -left-[50px] md:-left-[50px] w-[130px] md:w-[150px] lg:w-[200px] h-[130px] md:h-[150px] lg:h-[200px] bg-gradient-to-br from-white/0 from-[20%] to-white/40"></div>

      <Image
        src={getImage(feature.iconURL)}
        alt="Itinerary-icon.png"
        width={40}
        height={40}
        layout={'constrained'}
        objectFit={'fill'}
        className="absolute top-2 md:top-3 left-3 md:left-5 w-[40px] md:w-[60px] lg:w-[90px] h-[40px] md:h-[60px] lg:h-[90px] "
      />

      <h1 className="text-center md:text-start text-xs md:text-3xl font-bold">
        {feature.title}
      </h1>

      <p className="text-center md:text-start text-xs md:text-base">
        {feature.description}
      </p>
    </div>
  )
}

export default FeatureCard
