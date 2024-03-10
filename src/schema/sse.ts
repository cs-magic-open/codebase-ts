import { ICreateCallLLM } from "../../packages/common-llm/schema"
import { PusherServerId } from "../../packages/common-puser/config"
import { ILLMMessage } from "./message"

export type ResponseFinalStatus = "interrupted" | "responded" | "not-found"

export type ResponseStatus =
  | "unknown"
  | "to-response"
  | "responding"
  | ResponseFinalStatus

export type ILLMRequest = {
  pusherServerId?: PusherServerId
  status?: ResponseStatus
} & (
  | {
      type: "conv-title"
      convId?: string
    }
  | {
      requestId?: string | null
      type: "app-response"
      appId: string
    }
)

export const getTriggerIdFromSseRequest = (request: ILLMRequest) => {
  switch (request.type) {
    case "app-response":
      const { requestId, appId } = request
      return !!requestId && !!appId ? `chat@${requestId}.${appId}` : null

    case "conv-title":
      const { convId } = request
      return !!convId ? `title@${convId}` : null

    default:
      return null
  }
}

export type LlmActionPayload = { request: ILLMRequest } & (
  | {
      app: ICreateCallLLM
      context: ILLMMessage[]
      llmDelay?: number
      action: "trigger"
    }
  | { action: "interrupt" }
)