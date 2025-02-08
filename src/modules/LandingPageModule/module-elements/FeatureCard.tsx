import { type FeatureCardProps } from '../interface'
import Image from 'next/image'

const FeatureCard: React.FC<FeatureCardProps> = (feature) => {
  return (
    <div className="relative w-full min-h-40 pl-[18%] text-white bg-gradient-to-br from-white/40 from-[10%] to-white/5 rounded-3xl py-5 space-y-2 flex flex-col justify-center overflow-hidden ">
      <div className="backdrop-sm absolute -top-16 -left-14 rounded-full w-48 h-48 bg-gradient-to-br from-white/0 from-[20%] to-white/40"></div>
      <div className="backdrop-sm absolute -top-20 -left-14 rounded-full w-60 h-60 bg-transparent outline outline-2 outline-white/10"></div>
      <div className="backdrop-sm absolute -top-24 -left-16 rounded-full w-72 h-72 bg-transparent outline outline-2 outline-white/10"></div>

      <Image
        src="/Itinerary-icon.png"
        alt="TopCategoryA"
        width={80}
        height={80}
        layout={'constrained'}
        objectFit={'fill'}
        className="absolute top-0 left-3"
      />

      <h1 className="text-3xl">{feature.title}</h1>

      <p className="text-sm font-light">{feature.description}</p>
    </div>
    //  <div className='w-full min-h-full relative'>
    //     <Card className='w-full min-h-40 pl-[18%] text-white bg-gradient-to-br from-white/40 from-[10%] to-white/5 border-transparent rounded-3xl'>
    //       <CardHeader>
    //       <div className='absolute -top-14 -left-14 rounded-full w-48 h-48 bg-gradient-to-br from-white/40 to-white/0 overflow-hidden'></div>
    //           <CardTitle>
    //               {feature.title}
    //           </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //           <div>{feature.description}</div>
    //       </CardContent>
    //     </Card>
    //   </div>
  )
}

export default FeatureCard
