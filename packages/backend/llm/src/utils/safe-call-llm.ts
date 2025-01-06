import { SEPARATOR_BOX } from "@cs-magic/common/const"
import { env } from "@cs-magic/common/env/get-env"
import logger from "@cs-magic/common/log/index"
import { formatError } from "@cs-magic/common/utils/format-error"
import { formatString } from "@cs-magic/common/utils/format-string"
import { HttpsProxyAgent } from "https-proxy-agent"
import type OpenAI from "openai"
import { v4 } from "uuid"

import {
  type ILlmQueryConfig,
  type ILlmQueryConfigExtra,
  type ILlmRes,
  defaultLlmQueryConfigExtra,
} from "../schema/llm.api"
import { callLlm } from "./call-llm"
import { formatLlmMessage } from "./format-llm-message"
import { model2provider } from "./model2provider"

// logEnv("api_key")

/**
 * todo: 集中队列
 *
 * @param queryConfig
 * @param queryConfigExtra
 */
export const safeCallLLM = async (
  queryConfig: ILlmQueryConfig,
  queryConfigExtra: ILlmQueryConfigExtra = defaultLlmQueryConfigExtra,
): Promise<ILlmRes> => {
  // 队列上锁

  const llmProviderType = model2provider(queryConfig.model)

  const baseURL =
    llmProviderType === "moonshot"
      ? "https://api.moonshot.cn/v1"
      : llmProviderType === "deepseek"
        ? "https://api.deepseek.com/v1"
        : undefined

  const API_KEY_NAME = `${llmProviderType}_api_key`.toUpperCase() as keyof typeof env
  const apiKey = env?.[API_KEY_NAME]

  if (!apiKey) throw new Error(`missing env variable of ${API_KEY_NAME}`)

  const httpAgent = env?.PROXY ? new HttpsProxyAgent(env?.PROXY) : undefined

  const clientConfig = {
    apiKey,
    baseURL,
    httpAgent,
    // 最简单的响应是在 1-2 s 间
    // 当 timeout后，会延迟3秒返回
    // 如果不用stream的话，延迟可能会很长
    timeout: 60e3, // ms
  }

  const messages =
    llmProviderType === "baichuan"
      ? [
          {
            role: "user" as const,
            content: queryConfig.messages.map(r => r.content).join("\n\n## 输入\n\n"),
          },
        ]
      : queryConfig.messages

  // if (queryConfigExtra.context?.trimStart?.whenTooLong) {
  //   // avoid context overflow
  //   trimMessages(messages, queryConfig.model)
  // }

  queryConfig.messages = messages

  logger.debug(
    [
      `>> calling LLM(provider=${llmProviderType}, model=${queryConfig.model}, api_key=${apiKey}): `,
      SEPARATOR_BOX,
      ...queryConfig.messages.map(m => formatLlmMessage(m, 240)),
      SEPARATOR_BOX,
    ].join("\n"),
  )

  let response: OpenAI.Chat.Completions.ChatCompletion | undefined = undefined
  const start = Date.now()
  let success = false
  let error: string | undefined = undefined
  const queryId = v4()

  try {
    response = await callLlm({
      queryConfig,
      llmProviderType,
      apiKey,
      clientConfig,
    })
    success = true
  } catch (e) {
    //   todo: return error
    error = formatError(e)
  }
  const end = Date.now()
  const res = {
    options: queryConfig,
    response,
    query: {
      id: queryId,
      start,
      end,
      duration: (end - start) / 1e3,
      success,
    },
    error,
  }

  logger.info(`llm response: ${formatString(JSON.stringify(res), 60)}`)
  return res
}
