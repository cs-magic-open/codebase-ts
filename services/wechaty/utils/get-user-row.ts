import { Message } from "wechaty"
import { prisma } from "../../../packages/common-db/providers/prisma"

export const getUserRow = async (message: Message) => {
  const row = await prisma.wechatUser.findFirstOrThrow({
    where: { id: message.talker().id },
  })

  return row
}