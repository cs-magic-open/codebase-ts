import { logger } from "../log"
import { formatError } from "../utils/format-error"
import type { TransEventType } from "./schema"

export const fetchSSE = (
  requestUrl: string,
  options?: {
    onOpen?: () => void
    onData?: (data: string) => void
    onError?: (data: string) => void
    onOutput?: (output: string) => void
    onFinal?: (sse: EventSource) => void
  },
) => {
  /**
   * sse 要自己控制关闭，https://stackoverflow.com/a/54385424/9422455
   */
  const sse = new EventSource(requestUrl)

  const doEnd = () => {
    if (options?.onFinal) options.onFinal(sse)
    sse.close()
  }

  sse.onopen = () => {
    if (options?.onOpen) options.onOpen()
    logger.info("[sse] opened")
  }

  sse.addEventListener("data" as TransEventType, (ev: MessageEvent<string>) => {
    logger.info("[sse] onData: %o", ev)
    if (options?.onData) options.onData(JSON.parse(ev.data) as string)
  })

  /**
   * todo: error 占用了系统的 error 通道?
   */
  sse.addEventListener("error" as TransEventType, (ev: MessageEvent<string>) => {
    formatError(ev)

    if (options?.onError)
      options.onError(typeof ev.data === "string" ? (JSON.parse(ev.data) as string) : ev.data)

    doEnd()
  })

  sse.onerror = err => {
    // 2 是结束
    if (err.eventPhase !== 2) console.warn(`event source error: `, err)
    else logger.info("[sse] closed")

    doEnd()
  }

  return sse
}
