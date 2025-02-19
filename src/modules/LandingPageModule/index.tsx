import React from 'react'
import {
  AboutSection,
  FeatureSection,
  Header,
  PreRegisterSection,
} from './sections'
import { customFetch } from '@/utils/customFetch'
import { type PreRegisterCountResponse } from './interface'
import { MockupSection } from './sections/MockupSection'
import { CapabilitiesSection } from './sections/CapabilitiesSection'
import { CreateItinerarySection } from './sections/CreateItinerarySection'
import { getImage } from '@/utils/getImage'
import Image from 'next/image'

export const LandingPageModule: React.FC = async () => {
  const response = await customFetch<PreRegisterCountResponse>(
    '/pre-register/count'
  )

  return (
    <>
      <Header />
      {/* <FeatureSection /> */}
      <div className="w-full h-fit overflow-hidden relative">
        <div className="absolute w-full aspect-[1440/1950] top-1/4">
          <Image
            src={getImage('landing-page-demo-bg-blue.png')}
            alt="Section Background"
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-b from-[#0059B3] to-white" />

        <CreateItinerarySection />
        <CapabilitiesSection />
        <MockupSection />
      </div>

      <AboutSection />
      <PreRegisterSection count={response.count} />
    </>
  )
}
