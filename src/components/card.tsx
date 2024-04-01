"use client"

import { forwardRef, HTMLAttributes } from "react"
import { cn } from "../../packages/common-ui-shadcn/utils"
import { CardHeader } from "./card-vidw-header"
import { CardContent } from "./card-view-content"
import { CardFooter } from "./card-view-footer"

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg corner-gradient mx-4 w-full sm:w-[480px]",
          className,
        )}
        {...props}
      >
        <CardHeader />
        <div className={"w-full grow gap-2 p-2 min-h-72"}>
          <CardContent />
        </div>
        <CardFooter />
      </div>
    )
  },
)
Card.displayName = "Card"
