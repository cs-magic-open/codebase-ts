import { isClient } from "./is-client"

/**
 * ref: https://stackoverflow.com/a/30026162
 */
export const isWechatBrowser = isClient && /micromessenger/i.test(navigator.userAgent)
