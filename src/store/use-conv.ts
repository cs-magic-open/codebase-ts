import { useRouter } from "next/navigation"
import { api } from "@/lib/trpc/react"
import { toast } from "sonner"
import { nanoid } from "nanoid"
import { NANOID_LEN } from "@/config/system"
import { conversationStore } from "@/store/conversation"
import { remove } from "lodash"
import { IMessageInChat } from "@/schema/message"

/**
 * 1. 用户在首页query后将自动触发新建一个会话
 * 2. 用户在会话列表可以点击新增一个会话
 * --
 * 返回 id，用于其他的函数
 */
export function useAddConversation() {
  const router = useRouter()
  const addConversation = api.llm.addConversation.useMutation({
    onError: () => {
      // todo: more friendly alert dialog
      toast.error("不好意思，新建会话失败，请刷新后再试，该会话将被重置！")
    },
  })

  return async () => {
    /**
     * 本地新增
     */
    const conversationId = nanoid(NANOID_LEN)
    conversationStore.conversations.splice(0, 0, {
      id: conversationId,
      title: "",
    })

    /**
     * 数据库新增
     */
    const conversation = await addConversation.mutateAsync({
      id: conversationId,
      pApps: conversationStore.apps,
      type: "LLM",
    })
    conversationStore.conversation = conversation

    /**
     * 路由跳转
     */
    router.push(`/tt/${conversationId}`) // 异步
    return conversation
  }
}

/**
 * 用户在会话列表页的展开工具里删除一个会话
 * @param conversationId
 */
export function useDelConversation() {
  const router = useRouter()
  const delConversation = api.llm.delConversation.useMutation({
    onError: (error) => {
      console.error(error)
      toast.error("删除失败！")
    },
  })

  return (conversationId: string) => {
    // optimistic update
    remove(conversationStore.conversations, (c) => c.id === conversationId)
    if (conversationId === conversationStore.conversation?.id)
      router.push("/tt")

    void delConversation.mutateAsync({ conversationId })
  }
}

export const useDeleteAllConversations = () => {
  const router = useRouter()
  const deleteAllConversations = api.llm.deleteAllConversations.useMutation({
    onSuccess: () => {
      conversationStore.conversations = []
      router.push("/tt")
    },
  })
  return () => deleteAllConversations.mutate()
}

/**
 * 1. 用户在首页query
 * 2. 用户在会话里query
 * @param query
 */
export function useConvQuery() {
  const addConversation = useAddConversation()

  const queryLLM = api.llm.queryConversation.useMutation({
    onError: () => {
      // todo: any rollback?
      toast.error("消息回复出错，请刷新后重试！")
    },
  })

  return async (query: string) => {
    if (!query) return toast.error("不能为空")

    // 1. 若此时还没有会话，则先创建会话
    if (!conversationStore.conversation) await addConversation()

    // 2. 现在有会话了
    const { messages, context, lastRepliedMessage, conversation } =
      conversationStore
    const conversationId = conversation!.id

    // 3. 创建新消息
    const userMessageId = nanoid(NANOID_LEN)
    const userMessage: IMessageInChat = {
      id: userMessageId,
      updatedAt: new Date(),
      content: query,
      role: "user",
      conversationId,
      pAppId: null,
      parentId: null,
    }
    messages.push(userMessage)

    // 4. 维护新的context，context只在发送时更新
    if (lastRepliedMessage) context.push(lastRepliedMessage)
    context.push(userMessage)
    console.log("query: ", { context, messages })

    // 5. SSE
    const data = await queryLLM.mutateAsync({
      conversationId,
      messages: context,
    })
    data.forEach(({ requestId, result /*true*/ }) => {
      const pApp = conversationStore.apps.find((p) => p.id === requestId)
      // 有可能已经换成新的pApp了
      if (pApp) pApp.needFetchLLM = true
    })
  }
}
