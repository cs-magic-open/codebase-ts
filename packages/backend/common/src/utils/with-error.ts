import { formatError } from "./format-error"

export const withError = (s: string) => async (func: Promise<any>) => {
  try {
    return await func
  } catch (e) {
    formatError(e)
    throw new Error(s)
  }
}
