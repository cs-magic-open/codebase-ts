"use client"

import { columns, DataTable } from "@/app/swot/connection/contacts.table"
import { StandardCard } from "@/components/standard-card"
import { useUserIsAdmin } from "@/hooks/use-user"
import {
  botContactsAtom,
  botLoggedInAtom,
  botLoggingAtom,
  botScanningAtom,
  botScanStatusAtom,
  botScanValueAtom,
  botSocketOpenedAtom,
  botUserAtom,
  ScanStatus,
} from "@/store/bot.atom"
import { logger } from "@cs-magic/log/logger"
import { IWechatBotTransfer } from "@cs-magic/wechaty/schema/bot.utils"
import { useAtom } from "jotai"
import { QRCodeSVG } from "qrcode.react"
import { env } from "@cs-magic/common/deps/env"
import { useInit } from "@cs-magic/common/deps/hooks/use-init"
import { socketStatusMap } from "@cs-magic/common/deps/transport/schema"
import {
  Button,
  buttonVariants,
} from "@cs-magic/common/deps/ui-shadcn/components/button"
import { cn } from "@cs-magic/common/deps/ui-shadcn/utils"
import { ButtonWithLoading } from "@cs-magic/common/deps/ui/components/button-with-loading"
import { FlexContainer } from "@cs-magic/common/deps/ui/components/flex-container"
import { LabelLine } from "@cs-magic/common/deps/ui/components/label-line"
import { CSVLink, CSVDownload } from "react-csv"
import { toast } from "sonner"

export default function BotPage() {
  const [botScanning, setBotScanning] = useAtom(botScanningAtom)
  const [botScanValue, setBotScanValue] = useAtom(botScanValueAtom)
  const [botScanStatus, setBotScanStatus] = useAtom(botScanStatusAtom)
  const [botUser, setBotUser] = useAtom(botUserAtom)
  const [botContacts, setBotContacts] = useAtom(botContactsAtom)
  const [botSocketOpened, setBotSocketOpened] = useAtom(botSocketOpenedAtom)
  const [botLoggedIn, setBotLoggedIn] = useAtom(botLoggedInAtom)
  const [botLogging, setBotLogging] = useAtom(botLoggingAtom)

  const isAdmin = useUserIsAdmin()

  const socket = useInit<WebSocket>(() => {
    console.log("-- initing socket --")
    const socket = new WebSocket(env.NEXT_PUBLIC_SOCKET_URL!)

    socket.addEventListener("error", console.error)

    socket.addEventListener("open", () => {
      setBotSocketOpened(true)
    })

    socket.addEventListener("close", () => {
      setBotSocketOpened(false)
    })

    socket.addEventListener("message", (event: MessageEvent<string>) => {
      // console.log({ event });

      try {
        const data = JSON.parse(event.data) as IWechatBotTransfer

        console.log("-- data: ", data)
        switch (data.type) {
          case "scan":
            setBotScanning(true)
            setBotScanValue(data.data.value)
            setBotScanStatus(data.data.status)
            break

          case "login":
            setBotScanning(false)
            setBotUser(data.data)
            break

          case "loggedIn":
            setBotLoggedIn(data.data)
            setBotLogging(false)
            break

          case "preference":
            break

          case "contacts":
            // console.log("contacts: ", data.data.slice(0, 5))
            setBotContacts(data.data.filter((c) => !!c.friend))
            break
        }
      } catch (e) {
        // prettyError(e);
      }
    })

    return socket
  })

  logger.info({ botUser, botContacts })

  return (
    <FlexContainer
      orientation={"vertical"}
      className={
        cn()
        // "bg-cyan-950"
      }
    >
      <StandardCard title={"Socket"}>
        {!socket ? (
          "Socket初始化中……"
        ) : (
          <>
            <LabelLine title={"readyState"}>
              {socketStatusMap[socket.readyState]}
            </LabelLine>
          </>
        )}
      </StandardCard>

      {botSocketOpened && (
        <>
          <StandardCard title={"Bot Actions"}>
            <div className={"flex items-center gap-2"}>
              <ButtonWithLoading
                loading={botLogging}
                disabled={botScanning || botLoggedIn}
                onClick={() => {
                  setBotLogging(true)
                  socket?.send("start 1")
                }}
              >
                Log In
              </ButtonWithLoading>

              <Button
                disabled={!botUser || !botLoggedIn}
                onClick={() => {
                  socket?.send("stop")
                }}
              >
                Pause
              </Button>

              {isAdmin && (
                <Button
                  disabled={!botUser || !botLoggedIn}
                  onClick={() => {
                    socket?.send("logout")
                  }}
                >
                  Log Out
                </Button>
              )}
            </div>
          </StandardCard>

          {botScanning && (
            <StandardCard title={"Scan"}>
              <LabelLine title={"Status"}>
                {ScanStatus[botScanStatus]}
              </LabelLine>

              <QRCodeSVG value={botScanValue} />
            </StandardCard>
          )}

          {botUser && (
            <StandardCard title={"Bot Payload"}>
              <div>id: {botUser?.id}</div>
              <div>name: {botUser?.name}</div>

              <div className={"flex gap-2"}>
                <Button
                  onClick={() => {
                    socket?.send("get-contacts")
                  }}
                >
                  Get Contacts
                </Button>

                {botContacts && (
                  <CSVLink
                    className={cn(buttonVariants({}))}
                    data={botContacts}
                    filename={"contacts.csv"}
                    onClick={() => {
                      toast.success("downloaded")
                    }}
                  >
                    Dump Contacts
                  </CSVLink>
                )}
              </div>

              {botContacts && (
                <div>
                  <div className={"max-h-[320px] overflow-auto"}>
                    <DataTable columns={columns} data={botContacts} />
                  </div>
                </div>
              )}
            </StandardCard>
          )}
        </>
      )}
    </FlexContainer>
  )
}
