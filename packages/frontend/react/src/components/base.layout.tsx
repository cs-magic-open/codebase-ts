import { Toaster } from "@cs-magic/shadcn/ui/sonner"
import React from "react"

import { GlobalProvider } from "./global.provider"
import { LoadingAlertDialog } from "./loading"

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  // console.log(ansiColors.red("== RootLayout =="))

  return (
    <GlobalProvider>
      {children}

      <Toaster richColors closeButton={false} duration={3000} position={"top-right"} />

      <LoadingAlertDialog />

      {/*/!* 开发专用 *!/*/}
      {/*<Dev />*/}
    </GlobalProvider>
  )
}
