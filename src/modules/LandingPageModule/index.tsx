import React from 'react'
import {
  AboutSection,
  FeatureSection,
  Header,
  PreRegisterSection,
} from './sections'

export const LandingPageModule: React.FC = () => {
  return (
    <>
      <Header />
      <AboutSection />
      <FeatureSection />
      <PreRegisterSection />
    </>
  )
}
