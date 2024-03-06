import { ComponentProps, useEffect, useRef } from "react"
import { Input } from "./ui/input"
import { cn } from "../lib/utils"

import { SMS_DIGIT_SIZE } from "@/config/sms"

export const DigitContainer = ({
  className,
  maxLength,
  focus,
  ...props
}: ComponentProps<typeof Input> & { focus: boolean }) => {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!focus || !ref.value) return

    ref.value.focus()
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