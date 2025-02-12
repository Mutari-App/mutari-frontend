import React from 'react'
import {
  AboutSection,
  FeatureSection,
  Header,
  PreRegisterSection,
} from './sections'
import { customFetch } from '@/utils/customFetch'
import { type PreRegisterCountResponse } from './interface'

export const LandingPageModule: React.FC = async () => {
  const response = await customFetch<PreRegisterCountResponse>(
    '/pre-register/count'
  )

  return (
    <>
      <Header />
      <AboutSection />
      <FeatureSection />
      <PreRegisterSection count={response.count} />
    </>
  )
}
