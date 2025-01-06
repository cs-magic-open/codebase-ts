import type { ILlmMessage } from "@cs-magic/common/schema/message"
import type OpenAI from "openai"

import type { LlmModelType } from "./llm.models"

/**
 * 直接用于调用大模型的参数
 */
export type ILlmQueryConfig = {
  model: LlmModelType
  messages: ILlmMessage[]
  temperature?: number
  // todo: topP 是不对的参数
  // topP?: number
  stream?: boolean
  // 用户标识，例如 userId@roomId@wechat
  user?: string
}

export type ILlmQueryConfigExtra = {
  context?: {
    trimStart?: {
      whenTooLong?: boolean
    }
  }
}
export const defaultLlmQueryConfigExtra: ILlmQueryConfigExtra = {
  context: {
    trimStart: {
      whenTooLong: true,
    },
  },
}

export type ILlmRes = {
  options: ILlmQueryConfig
  query: {
    id: string
    start: number
    end?: number
    success: boolean
  }
  response?: OpenAI.Chat.Completions.ChatCompletion
  error?: string
}

export type IAgentReq = {
  name?: string
  author?: string
  version?: string
  model?: LlmModelType
  total_tokens?: number // 8912
  system_prompt?: string
  temperature?: number
  top_p?: number
}
