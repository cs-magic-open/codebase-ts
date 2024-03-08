import { appsPersistedAtom, uiSelectAppsDialogOpenAtom } from "@/store/app"
import {
  bestContextAtom,
  responseFinishedAtom,
  responsesAtom,
  serverConvDetailAtom,
} from "@/store/conv"
import ansiColors from "ansi-colors"
import { useAtom } from "jotai"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { api } from "packages/common/lib/trpc/react"
import { toast } from "sonner"
import { llmDelayAtom } from "../../packages/common/store"
import {
  uiCheckAuthAlertDialogOpenAtom,
  userPromptAtom,
} from "../../packages/common/store/user"
import { parseApp } from "../../packages/llm/schema"
import { IMessageInChat } from "../schema/message"

/**
 * 1. 用户在首页query
 * 2. 用户在会话里query
 * @param query
 */
export function useConvQuery() {
  let [conv] = useAtom(serverConvDetailAtom)
  const [persistedApps] = useAtom(appsPersistedAtom)
  const [, setOpen] = useAtom(uiCheckAuthAlertDialogOpenAtom)
  const [, setSelectAppsOpen] = useAtom(uiSelectAppsDialogOpenAtom)

  const [context] = useAtom(bestContextAtom)
  const [llmDelay] = useAtom(llmDelayAtom)
  const [prompt, setPrompt] = useAtom(userPromptAtom)

  const router = useRouter()

  const session = useSession()
  const query = api.core.query.useMutation()
  const addConv = api.core.addConv.useMutation()
  const utils = api.useUtils()

  const [responses] = useAtom(responsesAtom)
  const [responseFinished] = useAtom(responseFinishedAtom)

  return async () => {
    console.log(ansiColors.red("useQueryOnEnter: "), {
      query,
      responses,
      responseFinished,
    })

    if (!responseFinished) return toast.warning("等待流完成")

    if (!query) return toast.warning("不能为空")

    if (!persistedApps.length) {
      setSelectAppsOpen(true)
      return toast.warning("至少需要选中一种模型")
    }

    if (session.status !== "authenticated") {
      setOpen(true)
      return toast.warning("请登录")
    }

    // 若此时还没有会话，则先创建会话，并在创建后自动发起请求
    if (!conv) {
      conv = await addConv.mutateAsync(
        {
          title: undefined,
          apps: persistedApps.map((a) => parseApp(a)),
        },
        {
          onError: () => {
            toast.error("新建会话失败")
          },
          onSuccess: (data) => {
            void utils.core.listConv.invalidate()
          },
        },
      )
    }

    // 否则直接发起请求
    setPrompt("") // reset

    const newContext = [
      ...context,
      { content: prompt, role: "user" },
    ] as IMessageInChat[]

    query.mutate(
      {
        convId: conv.id,
        context: newContext,
        apps: persistedApps.map((a) => parseApp(a)),
        llmDelay,
      },
      {
        onSuccess: (requestIdNew) => {
          // 重置以拿到最新的数据
          void utils.core.getConv.invalidate()

          console.log(
            ansiColors.blue(
              `router push --> /tt/${conv!.id}?r=${requestIdNew}`,
            ),
          )
          router.push(`/tt/${conv!.id}?r=${requestIdNew}`)
        },
        onError: (err) => {
          console.error(err)
          toast.error("请求失败")
        },
      },
    )
  }
}