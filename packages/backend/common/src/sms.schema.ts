import { z } from "zod"

import { validatePhone } from "./sms.validation"

/**
 * 用户短信发送在form里需要的信息
 */
export const sendSmsSchema = z.object({
  phone: z.string().refine(validatePhone, "手机号格式不合法"),
})
export type ISendSms = z.infer<typeof sendSmsSchema>

/**
 * 调用短信服务商所需要的接口信息
 */
export type IProviderSendSms = (
  phone: string,
  code: string,
  expireMinutes: number, //
) => Promise<boolean>

export const smsSignInSchema = sendSmsSchema.and(
  z.object({
    code: z.string().refine(s => /\d{6}/.test(s), "验证码格式不合法"),
  }),
)
export type ISmsSignIn = z.infer<typeof smsSignInSchema>

export const profileUpdateSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
})
export type IProfileUpdate = z.infer<typeof profileUpdateSchema>

/**
 * sms basic
 */

export type SmsStage = "toSendSms" | "toAuth"
export type SmsProviderType = "tencent" | "ali"
