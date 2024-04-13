import { type MessageInterface } from "wechaty/impls"
import { z } from "zod"
import taskStatusSchema, {
  TaskStatusType,
} from "../../../prisma/generated/zod/inputTypeSchemas/TaskStatusSchema"
import { parseCommand } from "../utils/parse-command"
import { validateInput } from "../utils/validate-input"
import { BaseHandler } from "./base.handler"
import { todoCommands } from "./todo.commands"
import { TodoManager } from "./todo.manager"

export class TodoHandler extends BaseHandler {
  public async onMessage(message: MessageInterface) {
    const todoManager = new TodoManager("TODO系统", message, this.bot.wxid)

    const result = parseCommand<z.infer<typeof todoCommands>>(
      message.text(),
      todoCommands,
    )
    if (!result) return

    switch (result.command) {
      case "todo":
      case "list-todo":
        return todoManager.listTodoAction()

      case "add-todo":
        return todoManager.addTodo(result.args)

      case "update-todo":
        const m = /^\s*(\d+)\s*(.*?)\s*$/.exec(result.args)
        if (!m) throw new Error("输入不合法")
        const status = await validateInput<TaskStatusType>(
          taskStatusSchema,
          m?.[1],
        )
        return todoManager.updateTodo(Number(m[0]), status)
    }
  }
}
