import * as PUPPET from "wechaty-puppet";
import { log } from "wechaty-puppet";
import { AppMessageType } from "../../../../../wechaty-puppet/src/extra/message";
import { parseAppmsgMessagePayload } from "../../messages/message-appmsg.js";
import { LOGPRE } from "./message-parser.js";
//@ts-ignore
export const appMsgParser = async (padLocalMessage, ret, context) => {
    if (ret.type !== PUPPET.types.Message.Attachment) {
        return ret;
    }
    try {
        const appPayload = await parseAppmsgMessagePayload(padLocalMessage.content);
        context.appMessagePayload = appPayload;
        switch (appPayload.type) {
            case AppMessageType.Text:
                ret.type = PUPPET.types.Message.Text;
                ret.text = appPayload.title;
                break;
            case AppMessageType.Img:
            case AppMessageType.Audio:
                ret.type = PUPPET.types.Message.Url;
                break;
            case AppMessageType.Video:
                ret.type = PUPPET.types.Message.Url;
                break;
            case AppMessageType.Url:
                ret.type = PUPPET.types.Message.Url;
                break;
            case AppMessageType.Attach:
                ret.type = PUPPET.types.Message.Attachment;
                ret.filename = appPayload.title;
                break;
            case AppMessageType.ChatHistory:
                ret.type = PUPPET.types.Message.ChatHistory;
                break;
            case AppMessageType.MiniProgram:
            case AppMessageType.MiniProgramApp:
                ret.type = PUPPET.types.Message.MiniProgram;
                break;
            case AppMessageType.RedEnvelopes:
                ret.type = PUPPET.types.Message.RedEnvelope;
                break;
            case AppMessageType.Transfers:
                ret.type = PUPPET.types.Message.Transfer;
                break;
            case AppMessageType.RealtimeShareLocation:
                ret.type = PUPPET.types.Message.Location;
                break;
            case AppMessageType.GroupNote:
                ret.type = PUPPET.types.Message.GroupNote;
                ret.text = appPayload.title;
                break;
            default:
                ret.type = PUPPET.types.Message.Unknown;
                break;
        }
    }
    catch (e) {
        log.warn(LOGPRE, `Error occurred while parse message attachment: ${JSON.stringify(padLocalMessage)} , ${e.stack}`);
    }
    return ret;
};
