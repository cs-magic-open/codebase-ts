import { produce } from "immer"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { api } from "../../packages/common-trpc/react"
import { convAtom, convsAtom, requestIdAtom } from "../store/conv.atom"
import { getConvUrl } from "../utils"

/**
 * ⭐️⭐️⭐️ 2024-03-09 14:34:29
 *
 * 1. visit /tt/cid?r=rid
 * 1.1 cid --> conv -- !conv.rids.includes(rid) --> /tt/cid
 *
 * 2. visit /tt/cid
 * 2.1 cid --> conv -- !!conv.rid --> /tt/cid?r=rid
 *
 * @param convIdInUrl
 * @param reqIdInUrl
 */
export const useConvSearchParams = (
  convIdInUrl: string | undefined,
  reqIdInUrl: string | null,
) => {
  const [conv] = useAtom(convAtom)
  const [, setConvs] = useAtom(convsAtom)
  const updateConv = api.core.updateConv.useMutation()
  const [requestId] = useAtom(requestIdAtom)

  const router = useRouter()

  useEffect(() => {
    // 确保已经刷新对齐了conv
    if (conv && convIdInUrl && convIdInUrl === conv.id) {
      if (
        // 1. 没有 rid，但有游标
        (!reqIdInUrl && !!requestId) ||
        // 2. 有rid，但没有游标
        (reqIdInUrl && !conv.requests.some((r) => r.id === reqIdInUrl))
      )
        router.replace(getConvUrl(conv))
      // 从客户端触发更新数据库里的指针（无需invalidate）
      else if (reqIdInUrl && requestId !== reqIdInUrl) {
        console.log(`-- trigger db reqId: ${requestId} --> ${reqIdInUrl}`)

        // 更新convs里的指针（无需关心conv里的游标，因为始终以convs对齐）
        updateConv.mutate(
          {
            where: { id: conv.id },
            data: { currentRequestId: reqIdInUrl },
          },
          {
            onSuccess: () => {
              // utils.core.listConv.invalidate() // don't invalidate list, instead, use local sync
              setConvs((convs) =>
                produce(convs, (convs) => {
                  convs.find((c) => c.id === conv.id)!.currentRequestId =
                    reqIdInUrl
                }),
              )
            },
          },
        )
      }
    }
  }, [convIdInUrl, reqIdInUrl, conv?.id])
}