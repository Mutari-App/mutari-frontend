import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 d',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-gradient-to-r from-[#0073E6] to-[#004080] text-neutral-50 ',
        secondary: 'border-transparent bg-[#94A3B8] text-white',
        destructive:
          'border-transparent bg-red-500 text-neutral-50 hover:bg-red-500/80 ',
        outline: 'border-[#0073E6] text-[#0073E6]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
