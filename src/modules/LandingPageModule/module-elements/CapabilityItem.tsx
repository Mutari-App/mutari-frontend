import React from 'react'
import { CapabilityItemProps } from '../interface'

export const CapabilityItem: React.FC<CapabilityItemProps> = ({
  icon,
  title,
  desc,
}) => {
  return (
    <div className="flex flex-col items-center text-center  md:gap-4">
      {icon}
      <h3 className="font-semibold text-base  md:text-lg lg:text-xl min-h-14 flex items-center justify-center">
        {title}
      </h3>
      <p className="text-justify font-extralight text-xs md:text-sm lg:text-base">
        {desc}
      </p>
    </div>
  )
}
