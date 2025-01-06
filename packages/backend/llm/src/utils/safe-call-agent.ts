import logger from "@cs-magic/common/log/index"
import type { ILlmMessage } from "@cs-magic/common/schema/message"
import { compressContent } from "@cs-magic/common/utils/compress-content"

import type { ILlmQueryConfig } from "../schema/llm.api"
import type { LlmModelType } from "../schema/llm.models"
import { loadAgent } from "./load-agent"
import { safeCallLLM } from "./safe-call-llm"

// const __filename = fileURLToPath(import.meta.url)

export type AgentType = "default" | "summarize-content" | "summarize-ancient-title"

export const safeCallAgent = async ({
  input,
  agentType = "default",
  llmOptions,
  model,
}: {
  input: string
  model?: LlmModelType
  agentType?: AgentType
} & { llmOptions?: Omit<ILlmQueryConfig, "messages" | "model"> }) => {
  logger.info("-- agent calling: %o", {
    agentType,
    model,
    llmOptions,
    inputLength: input.length,
  })

  const agent = await loadAgent(agentType)

  model = model ?? agent.model
  if (!model) throw new Error("no model found")

  const messages: ILlmMessage[] = []
  if (agent.system_prompt)
    messages.push({
      role: "system",
      content: agent.system_prompt,
    })

  const maxContentLen =
    8192 -
    (agent.system_prompt?.length ?? 0) -
    1e3 - // 输出的预留长度
    1e2 // 误差

  const content = compressContent(input, maxContentLen)
  messages.push({
    role: "user",
    content,
  })

  return await safeCallLLM({
    model,
    messages,
    // topP: agent.top_p,
    temperature: agent.temperature,
    ...llmOptions,
  })
}
