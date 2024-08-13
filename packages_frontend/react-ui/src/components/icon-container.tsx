"use client"

import React, { ComponentProps, forwardRef } from "react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/shadcn/ui/tooltip"

// todo: why cn not okay
import { cn } from "@/shadcn/utils"
import clsx from "clsx"

export const IconContainer = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof TooltipTrigger> & {
    size?: "sm" | "lg"
    tooltipContent?: string
  }
>(({ className, size, tooltipContent, ...props }, ref) => {
  return (
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
  )
})
IconContainer.displayName = "IconContainer"
