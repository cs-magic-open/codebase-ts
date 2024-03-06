"use client"

import { useAtom } from "jotai"
import { cn } from "../../packages/common/lib/utils"
import { useConvSSE } from "../hooks/use-conv-sse"
import { IAppDetail } from "../schema/app.detail"
import { IContext, RoleType } from "../schema/message"
import { appIdPersistedAtom, appsPersistedAtom } from "../store/app"
import { requestAtom } from "../store/conv"
import { ConvAppMessages } from "./conv-app-messages"
import { ConvAppTopBar } from "./conv-app-top-bar"

export const ConvApp = ({
  app,
  commonContext,
}: {
  app: IAppDetail
  commonContext: IContext
}) => {
  const [persistedApps] = useAtom(appsPersistedAtom)
  const [selectedAppId] = useAtom(appIdPersistedAtom)
  const [request] = useAtom(requestAtom)

  const targetAppId = persistedApps.some((a) => a.id === app.id)
    ? app.id
    : selectedAppId
  const response = request?.responses.find((r) => r.appId === targetAppId)
  const context = !response
    ? commonContext
    : [
        ...commonContext,
        {
          content: response.error ?? response.response ?? "",
          role: "assistant" as RoleType,
          updatedAt: response.updatedAt,
          isError: !!response.error,
        },
      ]

  useConvSSE(app.id)

  // console.log({ appId: app.id, commonContext, response })

  return (
    <div
      className={cn(
        "w-full h-full overflow-auto flex flex-col relative border-t border-r",
      )}
    >
      <ConvAppTopBar app={app} />

      <ConvAppMessages
        appId={app.id}
        logo={app?.model.logo}
        context={context}
      />
    </div>
  )
}