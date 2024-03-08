import { type WritableStreamDefaultWriter } from "web-streams-polyfill/dist/types/ponyfill"

import { type ISseEvent } from "../../../../packages/common-sse/schema"
import { StaticLlmManager } from "./manager-static"

// export const llmManager = staticCreate<Record<string, ISSERequest>>(() => ({}))

// export const llmManager = new RedisLlmManager("llm-manager")
export const llmManager = new StaticLlmManager()

export const llmEncoder = new TextEncoder()

export const llmWrite = async (
  writer: WritableStreamDefaultWriter,
  sseEvent: ISseEvent,
) => {
  // 返回客户端不需要有 close 标志，直接 readystate=2 即可
  if (sseEvent.event === "close") return await writer.close()

  // 要额外加一个 \n，否则不符合格式规范
  await writer.write(
    llmEncoder.encode(
      `event: ${sseEvent.event}\ndata: ${JSON.stringify(sseEvent?.data ?? "")}\n\n`,
    ),
  )
}
