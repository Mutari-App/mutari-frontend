import React from 'react'

function CustomPin({
  number,
  color,
  title,
}: Readonly<{
  number?: number
  color?: string
  title?: string
}>) {
  return (
    <div
      className={`w-6 h-6 p-2 -rotate-45 text-xs text-white font-bold rounded-full rounded-bl-none border-2 
        border-white flex items-center justify-center ${color ?? 'bg-blue-800'} group`}
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
