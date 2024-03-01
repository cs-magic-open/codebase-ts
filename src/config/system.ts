import { env } from "@/env"
import { BRANDING_IDOUBI_AVATAR, BRANDING_MARK_AVATAR } from "@/config/assets"

export const SMS_PROVIDER_ID = "sms" // todo: server side NODE_ENV
export const SMS_CODE_DOWNTIME = 3
export const SMS_EXPIRE_MINUTES = 10
export const APP_URL = env.NEXT_PUBLIC_APP_URL
export const DATETIME_FORMAT = "YYYY-MM-DDThh:mm" // 根据MDN，日期选择组件只能精确到分钟，否则舒昱的iPhone 15 safari上会报错
export const WECHAT_DATETIME_FORMAT = "YYYY-MM-DD hh:mm:ss" // 根据MDN，日期选择组件只能精确到分钟，否则舒昱的iPhone 15 safari上会报错
export const WECHAT_APP_ID = "wx0fca1662e5518990"
export const WECHAT_API_URL = "https://api.weixin.qq.com"
export const USE_ALI_SMS = false
export const USE_TENCENT_SMS = true

export const SHOW_PARTNERS = false
// 独立开发者，要圆形的
export const INDIES_AVATARS: string[] = [
  BRANDING_MARK_AVATAR,
  BRANDING_IDOUBI_AVATAR,
]
// 企业banner
export const SPONSORS_BANNERS: string[] = []

export const REFETCH_TRPC_ON_WINDOW_FOCUS_ENABLED = false
