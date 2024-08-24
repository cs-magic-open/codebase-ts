"use server"

import { prisma } from "../../../db/prisma.js"
import logger from "../../../log/index.js"
import { SMS_PROVIDER_ID } from "../../../sms.base.js"
import { IProviderSendSms } from "../../../sms.schema.js"

/**
 * 发送验证码的时候，要创建Account以存储AccessToken，并在后续验证的时候实现登录
 *
 * 发送的时候，可能是有session的（微信登录后再SMS），所以会基于这个确定要不要新建或绑定用户
 *
 * @param phone
 * @param expireSeconds
 * @param sendApproach
 * @param userId
 */
export const $sendSms = async (
  phone: string,
  expireSeconds: number,
  sendApproach: IProviderSendSms,
  userId?: string,
) => {

  if(!userId) throw new Error("todo: without userId")

  const code = Math.random().toString().slice(2, 8)

  const ok = await sendApproach(phone, code, expireSeconds)

  if (ok) {
    const id = {
      providerAccountId: phone,
      provider: SMS_PROVIDER_ID,
    }
    const access_token = code
    const expires_at = Date.now() / 1e3 + expireSeconds

    const account = await prisma.account.upsert({
      where: {
        provider_providerAccountId: id,
        provider: SMS_PROVIDER_ID,
      },
      create: {
        ...id,
        type: "credentials",

        access_token,
        expires_at,

        // sms 首次登录只需要更新account的条目就行，甚至是别人的手机号
        user: {
              // link account or fallback create
              connectOrCreate: {
                where: { id: userId },
                create: {
                  platformId: userId,
                  platformType: "sms"
                },
              },
            },
      },
      update: {
        access_token,
        expires_at,

        // sms 再次登录时无需更新user相关的信息
      },
    })
    logger.info("[sms] account: %o", account)
  }
  return ok
}
