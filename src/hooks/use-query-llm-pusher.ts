import { Prisma } from "@prisma/client"
import ansiColors from "ansi-colors"
import { useEffect } from "react"
import { initPusherClient } from "../../packages/common-puser/client/init"
import { pusherServerConfigs } from "../../packages/common-puser/config"
import { ISseEvent, SseEventType } from "../../packages/common-sse/schema"
import { getTriggerIdFromSseRequest, ILLMRequest } from "../schema/sse"
import { updateAppResponseAtom } from "../store/conv"
import { transportTypeAtom } from "../store/query"
import { useAtom } from "jotai"

export const useQueryLlmPusher = (sseRequest: ILLMRequest) => {
  const [transportType] = useAtom(transportTypeAtom)
  const [, updateAppResponse] = useAtom(updateAppResponseAtom)

  const triggerId = getTriggerIdFromSseRequest(sseRequest)

  const update = (
    func: (data: Prisma.ResponseUncheckedCreateInput) => void,
  ) => {
    if (sseRequest.type !== "app-response" || !sseRequest.requestId) return

    updateAppResponse(sseRequest.requestId, sseRequest.appId, func)
  }

  useEffect(() => {
    if (transportType !== "pusher") return

    const pusher = initPusherClient(
      pusherServerConfigs[sseRequest.pusherServerId],
    )
    const channel = pusher.subscribe(triggerId)
    console.log(ansiColors.red(`pusher bounds to channel: ${triggerId}`), {
      triggerId,
    })

    const bindEvent = <T extends SseEventType>(
      type: T,
      func: (event: ISseEvent<T>) => void,
    ) => {
      channel.bind(type, (event: ISseEvent<T>) => {
        console.log(`[pusher-client] << `, event)
        func(event)
      })
    }

    bindEvent("data", (event) => {
      update((response) => {
        if (!response.content) response.content = event.data.token
        else response.content += event.data.token
      })
    })

    bindEvent("error", (event) => {
      update((response) => {
        response.error = event.data.message
      })
    })

    bindEvent("init", (event) => {
      update((response) => {
        response.tStart = new Date()
      })
    })

    bindEvent("close", (event) => {
      update((response) => {
        response.tEnd = new Date()
      })
    })

    return () => {
      pusher.unsubscribe(triggerId)
    }
  }, [triggerId])
}
