import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'> & { prefix?: string }
>(({ className, type, prefix, ...props }, ref) => {
  return (
    <div className="relative flex items-center w-full">
      {prefix && (
        <>
          <span className="absolute left-2 text-neutral-500 ">{prefix}</span>
          <div className="absolute left-11 w-[1px] h-3/5 bg-neutral-500" />
        </>
      )}
      <input
        type={type}
        className={cn(
          'text-black flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ',
          prefix ? 'pl-[50px]' : '',
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
})
Input.displayName = 'Input'

export { Input }
