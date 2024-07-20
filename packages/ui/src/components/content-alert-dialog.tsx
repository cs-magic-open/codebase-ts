"use client"
import { uiAlertDialogOpen } from "@cs-magic/store"
import { useAtom } from "jotai"
import React, { PropsWithChildren } from "react"
import { AlertDialog, AlertDialogContent } from "./shadcn/ui/alert-dialog.js"

export const ContentAlertDialog = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useAtom(uiAlertDialogOpen)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent
        onClick={() => {
          setOpen(false)
        }}
      >
        {children}
      </AlertDialogContent>
    </AlertDialog>
  )
}