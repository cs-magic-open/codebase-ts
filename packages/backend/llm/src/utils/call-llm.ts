import { api } from "@cs-magic/common/api/api"
import { backendApi } from "@cs-magic/common/api/backend-api"
import { md5 } from "js-md5"
import OpenAI, { type ClientOptions } from "openai"
import ZhipuAi from "zhipuai-sdk-nodejs-v4"

import type { ILlmQueryConfig } from "../schema/llm.api"
import type { LlmProviderType } from "../schema/llm.providers"

export type ICompletion = OpenAI.Chat.Completions.ChatCompletion

export const callLlm = async ({
  apiKey,
  llmProviderType,
  clientConfig,
  queryConfig,
}: {
  apiKey: string
  llmProviderType: LlmProviderType
  clientConfig: ClientOptions
  queryConfig: ILlmQueryConfig
}): Promise<ICompletion> => {
  // 要过滤 message为空的情形，否则某些api（例如moonshot）会报错，see https://github.com/cs-magic/codebase/issues/19
  queryConfig.messages = queryConfig.messages.filter(m => !!m.content.length)

  switch (llmProviderType) {
    case "zhipu":
      return (await new ZhipuAi(clientConfig).createCompletions(
        // todo: zhipu 支持 image_url 吗
        // @ts-ignore
        queryConfig,
      )) as unknown as ICompletion // todo: without unknown

    case "baichuan":
      return (
        await api.post<ICompletion>(
          "https://api.baichuan-ai.com/v1/chat/completions",
          queryConfig,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          },
        )
      ).data

    case "dashscope":
      return (await backendApi.post<ICompletion>("/llm/base", queryConfig, {})).data

    case "moonshot":
      // 2024-05-09 20:15:00: moonshot user 不能超过 32 位
      if (queryConfig.user && queryConfig.user.length > 32) {
        queryConfig.user = md5(queryConfig.user)
      }

    case "deepseek":
    case "openai":
    default:
      return (
        new OpenAI({
          ...clientConfig,
        }).chat.completions
          // todo: type hint
          .create(queryConfig as OpenAI.ChatCompletionCreateParamsNonStreaming)
      )
  }
}
