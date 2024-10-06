import { ILlmMessage } from "@cs-magic/common/schema/message";
import { formatString } from "@cs-magic/common/utils/format-string";

export const formatLlmMessage = (m: ILlmMessage, maxLength = 40) =>
  // `  [${m.role[0]!.toUpperCase()}]: ${formatString(JSON.stringify(m.content), maxLength)}`
  `  [${m.role}]: ${formatString(JSON.stringify(m.content), maxLength)}`;
