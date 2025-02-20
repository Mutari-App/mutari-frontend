import React from 'react'
import { CAPABILITIES } from '../constant'
import { CapabilityItem } from '../module-elements/CapabilityItem'

export const CapabilitiesSection: React.FC = () => {
  return (
    <section className="relative my-24 container px-4 max-w-screen-xl mx-auto text-white">
      <div className="grid grid-cols-1 max-w-md mx-auto md:max-w-none md:grid-cols-3 gap-8 sm:gap-12 md:gap-16 ">
        {CAPABILITIES.map((capability) => (
          <CapabilityItem key={capability.title} {...capability} />
        ))}
      </div>
    </section>
  )
}
