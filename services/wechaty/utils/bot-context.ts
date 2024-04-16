import { type Message, type Wechaty } from "wechaty"
import { type LangType } from "../../../packages/common-i18n/schema"
import {
  type IBotContext,
  type IBotDynamicContext,
  type IBotStaticContext,
} from "../schema/bot"
import { getConvPreference } from "./get-conv-preference"

export const getBotStaticContext = async (
  bot: Wechaty,
): Promise<IBotStaticContext> => bot.staticContext

export const getBotDynamicContext = async (
  lang: LangType,
): Promise<IBotDynamicContext> => {
  const data = (await import(`../config/bot.${lang}.json`)) as {
    name: string
  }
  return {
    ...data,
  }
}

export const getBotContext = async (
  bot: Wechaty,
  lang: LangType,
): Promise<IBotContext> => ({
  ...(await getBotStaticContext(bot)),
  ...(await getBotDynamicContext(lang)),
})

export const getBotContextFromMessage = async (
  bot: Wechaty,
  message: Message,
) => {
  // todo: use WechatyInterface
  const w = message.wechaty
  const preference = await getConvPreference(message)
  const context = await getBotContext(bot, preference.lang)
  return context
}