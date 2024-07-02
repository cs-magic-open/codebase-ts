/* eslint-disable sort-keys */
import { createAction } from 'typesafe-actions';
import { MessageType } from './message.js';
const payloadContact = (contactId) => ({ contactId });
const payloadFilebox = (filebox) => ({ filebox });
const payloadText = (text, mentions = []) => ({ text, mentions });
/**
 * expand/merge the payload altogether
 */
const payloadLocation = (locationPayload) => ({ ...locationPayload });
const payloadMiniProgram = (miniProgramPayload) => ({ ...miniProgramPayload });
const payloadUrlLink = (urlLinkPayload) => ({ ...urlLinkPayload });
const payloadPost = (postPayload) => ({ ...postPayload });
/**
 * using `types` as a static typed string name list for `createAction`
 *
 *  Huan(202201): if we remove the `(() => ({}))()`, then the typing will fail.
 *    FIXME: remove the `(() => ({}))()` after we fix the issue.
 */
const sayableTypes = (() => ({
    ...Object.keys(MessageType)
        .filter(k => isNaN(Number(k)))
        .reduce((acc, cur) => ({
        ...acc,
        [cur]: cur,
    }), {}),
}))();
/**
 * Simple data
 */
const contact = createAction(sayableTypes.Contact, payloadContact)();
const text = createAction(sayableTypes.Text, payloadText)();
// (conversationId: string, text: string, mentionIdList?: string[]) => ({ conversationId, mentionIdList, text }
/**
 * FileBoxs
 */
const attatchment = createAction(sayableTypes.Attachment, payloadFilebox)();
const audio = createAction(sayableTypes.Audio, payloadFilebox)();
const emoticon = createAction(sayableTypes.Emoticon, payloadFilebox)();
const image = createAction(sayableTypes.Image, payloadFilebox)();
const video = createAction(sayableTypes.Video, payloadFilebox)();
/**
 * Payload data
 */
const location = createAction(sayableTypes.Location, payloadLocation)();
const miniProgram = createAction(sayableTypes.MiniProgram, payloadMiniProgram)();
const url = createAction(sayableTypes.Url, payloadUrlLink)();
const post = createAction(sayableTypes.Post, payloadPost)();
/**
 * Huan(202201): Recursive type references
 *  @link https://github.com/microsoft/TypeScript/pull/33050#issuecomment-1002455128
 */
const sayablePayloadsNoPost = {
    attatchment,
    audio,
    contact,
    emoticon,
    image,
    location,
    miniProgram,
    text,
    url,
    video,
};
/**
 *
 * Huan(202201): Recursive type references
 *  @link https://github.com/microsoft/TypeScript/pull/33050#issuecomment-1002455128
 *  @link https://github.com/wechaty/puppet/issues/180
 */
const sayablePayloads = {
    ...sayablePayloadsNoPost,
    post,
};
export { sayablePayloads, sayableTypes, };
