import { AxiosError } from "axios"

import logger from "../log/index.js"

export const formatError = (e: unknown) => {
  const s = e instanceof AxiosError ? JSON.stringify(e.response?.data) : e instanceof Error ? e.message : (e as string)
  logger.error(`❌ 出错： ${s}`)
  return s
}
