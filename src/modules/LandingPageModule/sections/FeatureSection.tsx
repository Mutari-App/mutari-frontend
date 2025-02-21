import React from 'react'
import FeatureCard from '../module-elements/FeatureCard'
import { FEATURES } from '../constant'

export const FeatureSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-[#2FA9F4] to-[#0059B3] text-white flex flex-col items-center justify-center px-[10%] py-[5%] gap-8">
      <h1 className="text-3xl font-semibold">FITUR KAMI</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {FEATURES.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            iconURL={feature.icon}
          />
        ))}
      </div>
    </section>
  )
}
