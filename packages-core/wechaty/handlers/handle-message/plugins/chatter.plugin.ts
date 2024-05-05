import { SEPARATOR_LINE } from "@cs-magic/common/const"
import { logger } from "@cs-magic/log/logger"
import { ILlmMessage } from "@cs-magic/p01-common/schema/message"
import { types } from "wechaty"
import { z } from "zod"
import { prisma } from "../../../../../packages-to-classify/db/providers/prisma"
import { safeCallLLM } from "../../../../../packages-to-classify/llm"
import { trimMessages } from "../../../../../packages-to-classify/llm/utils/calculate-token"

import { formatLlmMessage } from "../../../../../packages-to-classify/llm/utils/format-llm-message"
import { FeatureMap, FeatureType } from "../../../schema/commands"
import { listMessagesOfLatestTopic } from "../../../utils/list-messages-of-latest-topic"
import { BasePlugin } from "./base.plugin"

const commandTypeSchema = z.enum([
  "enable",
  "disable",
  // "new", "list"
])
type CommandType = z.infer<typeof commandTypeSchema>
const i18n: FeatureMap<CommandType> = {
  en: {
    title: "Super Chatter",
    description:
      "Hello, I am the Super Chatter!" +
      "\nThe Only One AI Bot You Need in the WeChat ecosystem." +
      "\nWhat I can help you today? 🍺",
    commands: {
      enable: {
        type: "enable",
        description: "enable AI chat",
      },
      disable: {
        type: "disable",
        description: "disable AI chat",
      },
      // new: {
      //   type: "new",
      //   description: "create a new topic",
      // },
      // list: {
      //   type: "list",
      //   description: "list all the topics",
      // },
    },
  },
}

export class ChatterPlugin extends BasePlugin {
  static name: FeatureType = "chatter"
  public i18n = i18n

  async help() {
    const commands = await this.getCommands()
    const desc = await this.getDescription()
    const preference = await this.getConvPreference()
    await this.standardReply(
      [
        desc,
        SEPARATOR_LINE,
        "Status:",
        `  - enabled: ${preference.features.chatter.enabled}`,
        `  - model: ${preference.features.chatter.model}`,
      ].join("\n"),
      Object.keys(commands).map(
        (command) => `  ${ChatterPlugin.name} ${command}`,
      ),
    )
  }

  async safeReplyWithAI() {
    const m = this.message
    // todo: @all 的时候有bug
    // const mentionList = await m.mentionList()
    // const mentionIds = mentionList.map((m) => m.id)
    // logger.debug("mention ids: %o", mentionIds)

    if (
      // 过滤非文本 todo: image/xxxx
      m.type() !== types.Message.Text ||
      // 过滤自己的消息
      m.self() ||
      // 过滤微信官方
      m.talker().id === "weixin" ||
      // 过滤群聊中没有at自己的消息 （私信要回）
      (m.room() &&
        // 没有被 at
        (!(await m.mentionSelf()) ||
          // ignore all
          this.text.includes("@All")) &&
        // 也没有问号开头
        //   todo: 允许开头有空格，要与后续找信息时对上（重构一下）
        !/^\s*[?？]/.exec(this.text))
    )
      return

    const convPreference = await this.getConvPreference()
    if (!convPreference.features.chatter.enabled) {
      const convData = await this.getConvData()
      // todo: user control
      if (!convData.plugin.chatter.turnOnReminded) {
        // await this.reply(
        //   [
        //     "看起来您是想和我进行AI聊天，但是当前该插件功能并未开启，请先打开后继续",
        //     SEPARATOR_LINE,
        //     "该消息近仅提示一次",
        //   ].join("\n"),
        // )
      }

      return logger.debug(`!convPreference.features.chatter.enabled`)
    }

    const filteredMessages = await listMessagesOfLatestTopic(
      this.bot.context.wxid,
      this.convId,
    )

    const model = convPreference.features.chatter.model
    const messages: ILlmMessage[] = filteredMessages.map((m) => ({
      role:
        m.talkerId === this.bot.context.wxid
          ? ("assistant" as const)
          : ("user" as const),
      // todo: merge chats
      content: m.text ?? "",
    }))

    trimMessages(messages, model)
    // logger.info(`--  context(len=${context.length})`)

    void this.notify(
      [
        `🌈 calling LLM (model=${model})`,
        SEPARATOR_LINE,
        ...messages.map(formatLlmMessage),
      ].join("\n"),
      "chatter",
    )

    const res = await safeCallLLM({
      messages,
      model,
      user: await this.getUserIdentity(),
    })

    if (res.error) throw new Error(res.error)

    const content = res.response?.choices[0]?.message.content
    if (!content)
      throw new Error(
        `invalid response content, please check Query(id=${res.query.id})`,
      )

    void this.reply(content)
    void this.notify(
      [`✅ called LLM`, SEPARATOR_LINE, content].join("\n"),
      "chatter",
    )
  }
}
