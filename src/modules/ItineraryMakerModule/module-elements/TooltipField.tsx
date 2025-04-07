'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type TooltipFieldProps = {
  children: React.ReactNode
  feedback?: string
}

export const TooltipField = ({ children, feedback }: TooltipFieldProps) => {
  if (!feedback) return <>{children}</>

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="inline-block cursor-help">{children}</div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm bg-[#B62116] border shadow-lg text-white">
          {feedback}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
