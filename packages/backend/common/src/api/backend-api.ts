import { env } from "../env"
import { createHttpInstance } from "./core"

const baseURL = env?.NEXT_PUBLIC_BACKEND_URL
// logger.debug(`backend api baseURL: ${baseURL}`)
export const backendApi = createHttpInstance({
  baseURL,
})
