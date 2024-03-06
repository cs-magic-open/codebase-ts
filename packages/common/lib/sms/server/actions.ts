"use server"

import { userDetailSchema } from "@/schema/user.detail"
import { db } from "../../db"
import { SMS_PROVIDER_ID } from "../const"
import { IProfileUpdate, IProviderSendSms, ISmsSignIn } from "../schema"

export const $sendSms = async (
  phone: string,
  expireSeconds: number,
  sendApproach: IProviderSendSms,
) => {
  const code = Math.random().toString().slice(2, 8)

  const ok = await sendApproach(phone, code, expireSeconds)

  if (ok) {
    // todo: link account

    const id = {
      providerAccountId: phone,
      provider: SMS_PROVIDER_ID,
    }
    const access_token = code
    const expires_at = Date.now() / 1e3 + expireSeconds

    const account = await db.account.upsert({
      where: {
        provider_providerAccountId: id,
      },
      create: {
        ...id,
        type: "credentials",
        access_token,
        expires_at,

        user: {
          create: {
            /**
             * jwt not need this session
             */
            // sessions: {
            //   create: {
            //     sessionToken: v4(),
            //     expires: moment().add(10, "m").toDate(),
            //   },
            // },
          },
        },
      },
      update: {
        access_token,
        expires_at,
      },
    })
    console.log("[components] account: ", account)
  }
  return ok
}

export const $smsSignIn = async (values: ISmsSignIn) => {
  console.log("[sms] sign in with data: ", values)
  const { phone, code, name, image } = values

  const account = await db.account.findUnique({
    where: {
      provider_providerAccountId: {
        providerAccountId: phone,
        provider: SMS_PROVIDER_ID,
      },
      access_token: code,
    },
    include: { user: true },
  })

  if (!account) throw new Error("account not found")

  if (name && image) {
    return await db.user.update({
      where: { id: account.userId },
      data: {
        name,
        image,
      },
    })
  }
  return account.user
}