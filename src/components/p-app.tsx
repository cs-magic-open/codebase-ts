import { useSession } from "next-auth/react"
import { IconContainer } from "@/components/containers"
import {
  Lock,
  MinusCircleIcon,
  PlusCircleIcon,
  SettingsIcon,
  StopCircle,
  Unlock,
} from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { DEFAULT_AVATAR } from "@/config/assets"
import { useSnapshot } from "valtio"
import { cn } from "@/lib/utils"
import { openSelectPApps } from "@/store/ui"
import { useEffect, useRef, useState } from "react"
import { last } from "lodash"
import { nanoid } from "nanoid"
import { fetchSSE } from "@/lib/sse"
import {
  conversationStore,
  resetPAppSSE,
  selectPApp,
  useDelPApp,
} from "@/store/conversation"
import { IPAppClient } from "@/schema/conversation"
import { IMessageInChat } from "@/schema/message"

export const PAppComp = ({ pApp }: { pApp: IPAppClient }) => {
  const { id } = pApp

  const { currentConversationId, currentMessages } =
    useSnapshot(conversationStore)

  const [, setError] = useState("")
  const [fetching, setFetching] = useState(false)
  const lastUserMessage = last(
    currentMessages.filter((m) => m.role === "user"),
  )!
  const messageId = nanoid()

  useEffect(() => {
    if (!pApp.needFetchLLM) return
    void fetchSSE(`/api/llm?r=${id}`, {
      onOpen: () => {
        setFetching(true)
      },
      onFinal: () => {
        setFetching(false)
        resetPAppSSE(id)
      },
      onError: (data) => {
        setError(data)
        conversationStore.currentMessages.push({
          role: "assistant",
          content: data,
          id: messageId,
          updatedAt: new Date(),
          conversationId: currentConversationId!,
          pAppId: id,
          parentId: lastUserMessage.id,
          isError: true,
        })
      },
      onData: (data) => {
        // console.log({ onData: data })

        const lastAssistantMessage = conversationStore.currentMessages.find(
          (m) => m.parentId === lastUserMessage.id && m.pAppId === id,
        )!
        if (!lastAssistantMessage && currentConversationId) {
          conversationStore.currentMessages.push({
            role: "assistant",
            content: data,
            id: messageId,
            updatedAt: new Date(),
            conversationId: currentConversationId,
            pAppId: id,
            parentId: lastUserMessage.id,
          })
        } else {
          lastAssistantMessage.content += data
        }
      },
    })
  }, [pApp.needFetchLLM])

  // console.log({ error })

  return (
    <div
      className={cn(
        "w-full h-full overflow-hidden flex flex-col relative border-t border-r",
      )}
    >
      <TopBar id={id} title={pApp?.model.title} fetching={fetching} />

      <MessagesComp id={id} logo={pApp?.model.logo} />
    </div>
  )
}

const TopBar = ({
  id,
  title,
  fetching,
}: {
  id: string
  title: string
  fetching: boolean
}) => {
  const delPApp = useDelPApp()
  const { pApps, currentPAppId } = useSnapshot(conversationStore)
  const selected = id === currentPAppId
  const LockOrNot = selected ? Lock : Unlock
  // console.log({ id, currentPAppId })

  return (
    <div
      className={cn(
        "w-full overflow-hidden flex items-center p-2 border-b",
        selected && "border-b border-primary-foreground/50",
      )}
    >
      <div className={"flex items-center gap-2 overflow-hidden"}>
        <div className={"w-full flex gap-2 items-baseline"}>
          <span className={"truncate"}>{title}</span>

          {/*<span className={"text-muted-foreground text-xs"}>{id}</span>*/}
        </div>
      </div>
      <div className={"grow"} />

      <IconContainer
        tooltipContent={"选中当前的App，每次发送问题时以它的上下文对齐"}
        onClick={() => {
          selectPApp(id)
        }}
      >
        <LockOrNot className={cn(selected && "text-primary-foreground")} />
      </IconContainer>

      <IconContainer
        tooltipContent={"停止生成会话（仅限正在生成时使用）（TODO）"}
        onClick={() => {
          // selectPApp(id)
        }}
      >
        <StopCircle className={cn(!fetching && "text-muted-foreground")} />
      </IconContainer>

      <IconContainer
        tooltipContent={"删除一个App（注意，暂不可恢复）"}
        className={cn(pApps.length === 1 && "text-muted-foreground")}
        onClick={() => {
          void delPApp(id)
        }}
      >
        <MinusCircleIcon />
      </IconContainer>

      <IconContainer
        tooltipContent={"添加一个App（聊天内容与被选中App同步）"}
        onClick={openSelectPApps}
      >
        <PlusCircleIcon />
      </IconContainer>

      <IconContainer tooltipContent={"设置App（TODO）"}>
        <SettingsIcon />
      </IconContainer>
    </div>
  )
}

const MessagesComp = ({ id, logo }: { id: string; logo: string | null }) => {
  const { currentMessages, currentConversation } =
    useSnapshot(conversationStore)

  const refScroll = useRef<HTMLDivElement>(null)
  useEffect(() => {
    refScroll.current?.scrollIntoView({ behavior: "auto" })
  }, [currentMessages])

  const theMessages: IMessageInChat[] = []
  let mainMessageIndex = 0
  const mainMessages = currentConversation?.mainMessages ?? []
  currentMessages.forEach((m) => {
    if (mainMessageIndex >= mainMessages.length) {
      if (m.pAppId === id) theMessages.push(m)
    } else {
      if (m.id === mainMessages[mainMessageIndex]) {
        theMessages.push(m)
        ++mainMessageIndex
      }
    }
  })
  // console.log({ currentSnapshot, currentMessages, theMessages })

  return (
    <div className={"grow overflow-auto"}>
      {theMessages.map((m, index) => (
        <MessageComp m={m} logo={logo} key={index} />
      ))}

      <div ref={refScroll} />
    </div>
  )
}

const MessageComp = ({
  m,
  logo,
}: {
  m: IMessageInChat
  logo: string | null
}) => {
  const session = useSession()
  const userAvatar = session.data?.user?.image ?? DEFAULT_AVATAR

  return (
    <div className={"w-full flex gap-2 p-2"}>
      <Avatar className={"shrink-0"}>
        <AvatarImage
          src={m.role === "user" ? userAvatar : logo ?? DEFAULT_AVATAR}
        />
      </Avatar>

      <div
        className={cn(
          "p-2 rounded-lg overflow-hidden",
          m.isError && "text-destructive-foreground bg-destructive/75",
        )}
      >
        {m.content}
      </div>
    </div>
  )
}
