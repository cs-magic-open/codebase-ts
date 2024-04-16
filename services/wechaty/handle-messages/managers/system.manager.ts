import { z } from "zod"
import {
  type LangType,
  langTypeSchema,
} from "../../../../packages/common-i18n/schema"
import { type BackendType } from "../../../../packages/common-llm/schema/llm"
import {
  type LlmModelType,
  llmModelTypeSchema,
} from "../../../../packages/common-llm/schema/providers"
import { FeatureMap } from "../../schema/commands"
import { getConvPreference } from "../../utils/get-conv-preference"
import { getConvTable } from "../../utils/get-conv-table"
import { parseLimitedCommand } from "../../utils/parse-command"
import { BaseManager } from "./base.manager"

const commandTypeSchema = z.enum([
  "list-models",
  "set-model",
  // "set-backend",
  "list-langs",
  "set-lang",
])
type CommandType = z.infer<typeof commandTypeSchema>
const i18n: FeatureMap<CommandType> = {
  zh: {
    title: "操作系统",
    description: "这里是一些特权命令",
    commands: {
      查询模型: {
        type: "list-models",
        description: "查询支持的大模型列表",
      },
      设置模型: {
        type: "set-model",
        description: "设置选用另一款大语言模型",
      },
      查询语言: {
        type: "list-langs",
        description: "查询支持的语言列表",
      },
      设置语言: {
        type: "set-lang",
        description: "设置选用另一种系统语言",
      },
    },
  },
  en: {
    title: "Operating System",
    description: "There are some administrative commands",
    commands: {
      "list-models": {
        type: "list-models",
        description: "list supported LLM models",
      },
      "set-model": {
        type: "set-model",
        description: "switch to another LLM model",
      },
      "list-langs": {
        type: "list-langs",
        description: "list supported languages",
      },
      "set-lang": {
        type: "set-lang",
        description: "switch to another language",
      },
    },
  },
}

export class SystemManager extends BaseManager {
  public i18n = i18n

  async parse(input?: string) {
    if (!input) return this.help()

    const commands = this.i18n[await this.getLang()].commands
    const commandTypeSchema = z.enum(
      Object.keys(commands) as [string, ...string[]],
    )
    const parsed = parseLimitedCommand(input, commandTypeSchema)
    if (parsed) {
      const commandKeyInInput = parsed.command
      const commandKeyInEnum = commands[commandKeyInInput]?.type
      const commandType = await commandTypeSchema.parseAsync(commandKeyInEnum)
      switch (commandType) {
        case "list-model":
          await this.listModels()
          break

        case "set-model":
          const model = await llmModelTypeSchema.parseAsync(parsed.args)
          await this.setModel(model)
          break

        case "set-lang":
          const lang = await langTypeSchema.parseAsync(parsed.args)
          await this.setLang(lang)
          break
      }
    }
  }

  async listModels() {
    return this.standardReply(
      [...llmModelTypeSchema.options.map((o, i) => `${i + 1}. ${o}`)].join(
        "\n",
      ),
      ["system set-model"],
    )
  }

  async setModel(value: LlmModelType) {
    const preference = await getConvPreference(this.message)
    await getConvTable(this.message).update({
      where: {
        id: this.convId,
      },
      data: {
        preference: {
          ...preference,
          model: value,
        },
      },
    })
    await this.standardReply(`模型更新成功：${preference.model} --> ${value}`, [
      "system list-models",
    ])
  }

  async setBackend(value: BackendType) {
    const preference = await getConvPreference(this.message)
    await getConvTable(this.message).update({
      where: {
        id: this.convId,
      },
      data: {
        preference: {
          ...preference,
          backend: value,
        },
      },
    })
    await this.standardReply(
      `后端更新成功：${preference.backend} --> ${value}`,
      ["system list-backends"],
    )
  }

  async setLang(value: LangType) {
    const preference = await getConvPreference(this.message)
    await getConvTable(this.message).update({
      where: {
        id: this.convId,
      },
      data: {
        preference: {
          ...preference,
          lang: value,
        },
      },
    })
    await this.standardReply(`语言更新成功：${preference.lang} --> ${value}`, [
      "system list-langs",
    ])
  }
}