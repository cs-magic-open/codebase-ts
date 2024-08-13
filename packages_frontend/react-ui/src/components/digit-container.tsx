"use client"

import { cn } from "@/shadcn/utils"
import React, { ComponentProps, useEffect, useRef } from "react"

import { Input } from "@/shadcn/ui/input"
import { SMS_DIGIT_SIZE } from "@cs-magic/common/dist/config.js"

export const DigitContainer = ({
  className,
  maxLength,
  focus,
  ...props
}: ComponentProps<typeof Input> & { focus: boolean }) => {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!focus || !ref.current) return

    ref.current.focus()
  }, [focus])

  return (
    <Input
      ref={ref}
      className={cn(
        "w-8 h-8 sm:w-12 sm:h-12 rounded-lg  text-center p-0",
        SMS_DIGIT_SIZE,
        className,
      )}
      maxLength={1}
      {...props}
    />
  )
}