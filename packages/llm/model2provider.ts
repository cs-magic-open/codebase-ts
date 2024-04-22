import { LlmProviderType } from "./schema/providers"

export const model2provider = (modelType: string): LlmProviderType => {
  if (modelType.startsWith("gpt")) return "openai"
  if (modelType.startsWith("glm")) return "zhipu"
  if (modelType.startsWith("moonshot")) return "moonshot"
  if (modelType.startsWith("Baichuan")) return "baichuan"
  if (modelType.startsWith("qwen")) return "dashscope"
  throw new Error(`invalid LLM model type = ${modelType}`)
}