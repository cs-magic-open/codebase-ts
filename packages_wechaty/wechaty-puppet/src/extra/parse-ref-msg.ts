import { type payloads, types } from "src/mods/mod"

import { AppMessageType } from "src/extra/message"
import type { GenericMessageParser, MessageParserContext } from "src/extra/message.parser"
import { serializeRefMsgPayload } from "src/extra/serialize-ref-msg"

export const referMsgParser: GenericMessageParser = async <T>(
  _localMessage: T,
  ret: payloads.Message,
  context: MessageParserContext,
) => {
  const appMessagePayload = context.appMessagePayload
  // logger.info(`[refer] <-- ret`)
  // logger.info({ ret, localMessage, appMessagePayload })

  if (!appMessagePayload || appMessagePayload.type !== AppMessageType.ReferMsg) {
    return ret
  }

  const referMessagePayload = appMessagePayload.refermsg

  // todo: use extra type of PUPPET.types.Message, mark@2024-04-19 10:21:24
  ret.type = types.Message.Text

  // todo: possible undefined
  ret.text = !referMessagePayload
    ? appMessagePayload.title
    : `「${referMessagePayload.displayname}：${serializeRefMsgPayload(
        referMessagePayload,
      )}」\n- - - - - - - - - - - - - - -\n${appMessagePayload.title}`

  // logger.debug(`[refer] --> ret: %o`, ret)

  return ret
}