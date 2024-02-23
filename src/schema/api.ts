import { LlmModelType } from "@/schema/llm"

export type ITokenEventData = {
  id: string
  content: string
}
export type IEvent =
  | { event: "done" }
  | { event: "token"; data: ITokenEventData }

export type IGetConversationParams = {
  conversationId: string
}

export interface ICreateConversationBody {
  prompt: string
  modelName: LlmModelType
}

export type IConversationBody = ICreateConversationBody & IGetConversationParams

export interface IPostLlmRes {
  conversationId: string
}
