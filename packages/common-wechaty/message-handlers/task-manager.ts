import { type MessageInterface } from "wechaty/impls"
import { z } from "zod"
import { prisma } from "../../common-db/providers/prisma"
import { getConv } from "../utils/get-conv"
import { getTalkerPreference } from "../utils/get-talker-preference"
import { parseCommand } from "../utils/parse-command"
import { prettyBotQuery } from "../utils/pretty-bot-query"
import { BaseMessageHandler } from "./_base"

export const taskManagerSchema = z.union([
  z.literal("todo"),
  z.literal("add-todo"),
  z.literal("set-todo"),
])

export class TaskManagerMessageHandler extends BaseMessageHandler {
  public async onMessage(message: MessageInterface) {
    const result = parseCommand<z.infer<typeof taskManagerSchema>>(
      message.text(),
      taskManagerSchema,
    )
    if (!result) return

    const talkerId = message.talker().id
    const args = result.args
    const lang = (await getTalkerPreference(message))?.lang ?? "en"

    switch (result.command) {
      case "todo":
        const tasks = await prisma.task.findMany({
          where: { ownerId: talkerId },
        })
        await message.say(
          await prettyBotQuery(
            `任务管理`,
            tasks
              .map((t, i) => `${i + 1}) ${t.title} (${t.status})`)
              .join("\n"),
            lang,
            ["add-todo", "set-todo"],
            // [
            //   "/add-todo [TITLE]: 🆕个人任务",
            //   "/set-todo [N] [STATUS]: 📌任务状态",
            // ].join("\n"),
          ),
        )
        break

      case "add-todo":
        if (!args) {
          await message.say(
            await prettyBotQuery(
              `任务管理`,
              "添加任务失败，原因：不能为空",
              lang,
            ),
          )
        } else {
          await prisma.task.create({
            data: {
              ownerId: talkerId,
              title: args,
            },
          })
          await message.say(
            await prettyBotQuery(`任务管理`, `添加任务成功：${args}`, lang, [
              "todo",
            ]),
          )
        }
        break

      case "set-todo":
        const conv = await getConv(message)
        break
    }
  }
}
