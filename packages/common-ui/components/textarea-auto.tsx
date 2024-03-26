"use client"

import { userInputAtom } from "@/store/system.atom"
import { useAtom } from "jotai"
import { ComponentProps, forwardRef } from "react"
import ReactTextareaAutoSize from "react-textarea-autosize"
import { useMounted } from "../../common-hooks/use-mounted"
import { cn } from "../../common-ui-shadcn/utils"

export const TextareaAuto = forwardRef<
  HTMLTextAreaElement,
  ComponentProps<typeof ReactTextareaAutoSize> & {
    onQuery?: (s: string) => void
  }
>(({ className, minRows = 1, onKeyDown, onChange, onQuery, ...props }, ref) => {
  const mounted = useMounted()
  // avoid layout shift
  const rows = !mounted ? minRows : undefined
  const [prompt, setPrompt] = useAtom(userInputAtom)

  return (
    <ReactTextareaAutoSize
      rows={rows}
      minRows={minRows}
      maxRows={8}
      ref={ref}
      cacheMeasurements
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "block", // 不加这个会导致高度超标
        "resize-none focus-visible:outline-none bg-transparent",
        className,
      )}
      value={prompt}
      onChange={(event) => {
        // 更新用户的输入
        const value = event.currentTarget.value
        setPrompt(value)
        // console.log({ convId, value })
        if (onChange) onChange(event)
      }}
      onKeyDown={(event) => {
        if (onKeyDown) return onKeyDown(event)
        if (onQuery) {
          if (
            event.key === "Enter" &&
            !event.nativeEvent.isComposing &&
            !event.shiftKey &&
            !event.altKey
          ) {
            event.preventDefault()
            const value = event.currentTarget.value
            if (!value) return
            onQuery(value)
          }
        }
      }}
      {...props}
    />
  )
})
TextareaAuto.displayName = "TextareaAuto"
