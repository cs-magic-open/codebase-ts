import type { LlmProviderType } from "../schema/llm.providers"

export const model2provider = (modelType: string): LlmProviderType => {
  if (modelType.startsWith("gpt")) return "openai"
  if (modelType.startsWith("glm")) return "zhipu"
  if (modelType.startsWith("moonshot")) return "moonshot"
  if (modelType.startsWith("Baichuan")) return "baichuan"
  if (modelType.startsWith("qwen")) return "dashscope"
  if (modelType.startsWith("deepseek")) return "deepseek"
  throw new Error(`invalid LLM model type = ${modelType}`)
}
