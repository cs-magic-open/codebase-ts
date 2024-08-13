import { isWechatBrowser } from "@cs-magic/common/dist/env/is-wechat-browser.js"
import { useEffect, useState } from "react"

/**
 * 充分性：检测当前的环境
 * 必要性：有很多魔法代码
 */
export const useEnvironments = () => {
  const [isClient, setClient] = useState(false)
  const [isWechat, setWechat] = useState(false)
  const [isMobile, setMobile] = useState(false)

  useEffect(() => {
    if (isClient) setClient(true)
  }, [])

  useEffect(() => {
    setWechat(isWechatBrowser)
    setMobile(isMobile)
  }, [isClient])

  return { isClient, isWechat, isMobile }
}
