import type { ILlmMessage } from "@cs-magic/common/schema/message"
import { sum } from "lodash-es"
import { encoding_for_model } from "tiktoken"

import type { LlmModelType } from "../schema/llm.models"

/**
 * @see:
 *  - https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb
 *  - https://www.npmjs.com/package/tiktoken
 *
 *  todo: why the expected is 129, but we got 126 ?
 *
 * @param messages
 * @param model
 */
export const calculateToken = (messages: ILlmMessage[], model: LlmModelType) => {
  // the model is fixed to have an estimated value since we would support many other models (e.g. domestic)
  const encoding = encoding_for_model("gpt-3.5-turbo-0613")
  const tokens_per_message = 3
  const tokens_per_name = 1

  return sum(
    messages.map(m => {
      return (
        sum(
          Object.entries(m).map(([k, v]) => {
            // compatible when v is not a string
            if (typeof v !== "string") return 0

            let l = encoding.encode(v).length
            if (k === "name") l += tokens_per_name
            return l
          }),
        ) + tokens_per_message
      )
    }),
  )
}
