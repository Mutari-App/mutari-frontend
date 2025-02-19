import React from 'react'
import { CapabilityItemProps } from '../interface'

export const CapabilityItem: React.FC<CapabilityItemProps> = ({
  icon,
  title,
  desc,
}) => {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      {icon}
      <h3 className="font-semibold text-xl min-h-14 flex items-center justify-center">
        {title}
      </h3>
      <p className="text-justify font-extralight">{desc}</p>
    </div>
  )
}
