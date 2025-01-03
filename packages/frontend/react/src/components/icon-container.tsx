"use client"

import { cn } from "@cs-magic/shadcn/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@cs-magic/shadcn/ui/tooltip"
import clsx from "clsx"
import React, { type ComponentProps, forwardRef } from "react"

// todo: why cn not okay

export const IconContainer = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof TooltipTrigger> & {
    size?: "sm" | "lg"
    tooltipContent?: string
  }
>(({ className, size, tooltipContent, ...props }, ref) => {
  return (
    <TooltipProvider>
      <Tooltip disableHoverableContent delayDuration={100}>
        <TooltipTrigger
          ref={ref}
          className={clsx(
            // cn
            // 外部6，内部4是最佳的小图标比例
            " w-6 h-6",
            size === "lg" && "w-8 h-8",
            " p-1 [&>*]:w-full [&>*]:h-full center",
            "cursor-pointer",
            // "hover:bg-muted",
            className,
          )}
          {...props}
        />

        {tooltipContent && <TooltipContent>{tooltipContent}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  )
})
IconContainer.displayName = "IconContainer"
