import React from 'react'
import FeatureCard from '../module-elements/FeatureCard'
import { FEATURES } from '../constant'

export const FeatureSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-[#0073E6] to-[#0059B3] text-white flex flex-col items-center justify-center px-[20%] py-[10%] gap-8">
      <h1 className="text-3xl font-semibold">FEATURES</h1>

      {FEATURES.map((feature, index) => (
        <FeatureCard
          key={index}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </section>
  )
}
