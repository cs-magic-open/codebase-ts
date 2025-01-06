import { isClient } from "./is-client"

/**
 * todo: https://nextjs.org/docs/app/api-reference/functions/userAgent
 * ref: https://stackoverflow.com/a/14301832
 */
export const isMobileBrowser = isClient && /Mobi/i.test(navigator.userAgent)
