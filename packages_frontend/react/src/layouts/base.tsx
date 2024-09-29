import { LoadingAlertDialog } from "@/components/loading";
import { GlobalProvider } from "@/providers/global-provider";
import { cn } from "@cs-magic/shadcn/lib/utils";
import { Toaster } from "@cs-magic/shadcn/ui/sonner";
import React from "react";

import "@assets/styles/main.css";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // console.log(ansiColors.red("== RootLayout =="))

  return (
    // html should be at the top, for providing context
    <html lang="en" suppressHydrationWarning>
      {/*/ body should be the direct child of html */}
      <body
        className={cn(
          "relative w-screen h-screen overflow-y-auto",
          "overflow-x-hidden", // for arc sidebar
          `font-sans`, // inter.variable
          "bg-background text-foreground",
        )}
      >
        <GlobalProvider>
          {children}

          <Toaster
            richColors
            position={"top-right"}
            duration={3000}
            closeButton={false}
          />

          <LoadingAlertDialog />

          {/*/!* 开发专用 *!/*/}
          {/*<Dev />*/}
        </GlobalProvider>
      </body>
    </html>
  );
}