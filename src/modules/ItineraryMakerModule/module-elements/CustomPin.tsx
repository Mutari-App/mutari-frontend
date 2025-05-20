import React from 'react'

function CustomPin({
  number,
  color,
  title,
  highlighted,
}: Readonly<{
  number?: number
  color?: string
  title?: string
  highlighted?: boolean
}>) {
  return (
    <div
      data-location-pin="true"
      className={`${highlighted ? 'scale-125 z-10 shadow-lg' : ''}
        transition-transform duration-200
        w-6 h-6 p-2 -rotate-45 text-xs text-white font-bold rounded-full rounded-bl-none 
        border-2 border-white 
        flex items-center justify-center ${color ?? 'bg-blue-800'} group`}
    >
      <div className="rotate-45 relative">
        {number}
        {title && (
          <div
            className="absolute left-1/2 w-max -translate-x-1/2 bg-black/70 text-white px-2 py-1 
            hidden group-hover:flex rounded-md text-xs bottom-[120%]"
          >
            {title}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomPin
