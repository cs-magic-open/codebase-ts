import dotenv from "dotenv"
import { promises } from "fs"
import yaml from "js-yaml"
import path from "path"
import { fileURLToPath } from "url"
import { compressContent } from "../../common-common/compress-content"
import { callLLM } from "../call-llm"
import { LLMModelType } from "../schema/models"

dotenv.config()

export type ILLMMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

export type AgentConfig = {
  name?: string
  author?: string
  version?: string
  model?: LLMModelType
  total_tokens?: number // 8912
  system_prompt?: string
}

export type ICallLLMOptions = {
  model: LLMModelType
  messages: ILLMMessage[]
  temperature?: number
  topP?: number
  stream?: boolean
}

export const callAgent = async ({
  input,
  agentType = "default",
  options,
  model,
}: {
  input: string
  model?: LLMModelType
  agentType?: "default" | "summarize-content"
} & { options?: Omit<ICallLLMOptions, "messages" | "model"> }) => {
  console.debug("-- agent calling: ", { input, agentType, model, options })

  const __filename = fileURLToPath(import.meta.url)
  const yamlConfig = await promises.readFile(
    path.join(__filename, `../config/${agentType}.agent.yml`),
    { encoding: "utf-8" },
  )
  // how can I use some library to ensure the AgentConfig is consistent with the interface
  const agent = yaml.load(yamlConfig) as AgentConfig

  model = model ?? agent.model
  if (!model) throw new Error("no model found")

  const messages: ILLMMessage[] = []
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

  const result = await callLLM({
    model,
    messages,
    ...options,
  })
  return `<model>${model}</model>\n${result}`
}