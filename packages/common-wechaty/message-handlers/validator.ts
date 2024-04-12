import { type MessageInterface } from "wechaty/impls"
import { parseCommand } from "../utils/parse-command"
import { messageHandlerSchema, messageHandlerSchemas } from "./_all"
import { BaseMessageHandler } from "./_base"

export class ValidatorMessageHandler extends BaseMessageHandler {
  public async onMessage(message: MessageInterface) {
    const text = message.text()

    if (text.trim().startsWith("/")) {
      const result = parseCommand(message.text(), messageHandlerSchema)

      if (!result) {
        throw new Error(
          `无效的命令：${text}，仅支持：\n${messageHandlerSchemas
            .map((s) => s.options.map((o) => `/${o.value}`))
            .flat()
            .join("\n")}`,
        )
      }
    }
  }
}
