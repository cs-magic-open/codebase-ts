import type { SayablePayload, sayableTypes } from './sayable.js';
import type { TapType } from './tap.js';
/**
 * Huan(202201): numbers must be keep unchanged across versions
 */
declare enum PostType {
    Unspecified = 0,
    Moment = 1,// <- WeChat Moments (朋友圈)
    Channel = 2,// <- WeChat Channel (视频号)
    Message = 3
}
/**
 * Huan(202201): Error: referenced directly or indirectly in its own type annotation. ts(2502) #180
 *  @link https://github.com/wechaty/puppet/issues/180
 *
 * Recursive type references
 *  @link https://github.com/microsoft/TypeScript/pull/33050#issuecomment-1002455128
 *
 * The same as `createAction(sayableTypes.Post, payloadPost)()`
 *  but reference the `PostPayload` in interface directly
 *  to prevent the ts(2502) error
 */
interface SayablePayloadPost {
    type: typeof sayableTypes.Post;
    payload: PostPayload;
}
/**
 * Issue #2245 - https://github.com/wechaty/wechaty/issues/2245
 *
 * There have three types of a Post:
 *
 *  1. Original (原创)
 *  2. Reply    (评论, comment)
 *  3. RePost   (转发, retweet)
 *
 *  | Type     | Root ID     | Parent ID   |
 *  | ---------| ----------- | ----------- |
 *  | Original | `undefined` | `undefined` |
 *  | Reply    | rootId      | parentId    |
 *  | Repost   | `undefined` | parentId    |
 *
 */
interface PostPayloadBase {
    parentId?: string;
    rootId?: string;
    type?: PostType;
}
interface PostPayloadClient extends PostPayloadBase {
    id?: undefined;
    /**
     * Recursive type references
     * @link https://github.com/microsoft/TypeScript/pull/33050#issuecomment-1002455128
     */
    sayableList: SayablePayload[];
}
interface PostPayloadServer extends PostPayloadBase {
    id: string;
    sayableList: string[];
    contactId: string;
    timestamp: number;
    counter: {
        children?: number;
        descendant?: number;
        taps?: {
            [key in TapType]?: number;
        };
    };
}
type PostPayload = PostPayloadClient | PostPayloadServer;
declare const isPostPayloadClient: (payload: PostPayload) => payload is PostPayloadClient;
declare const isPostPayloadServer: (payload: PostPayload) => payload is PostPayloadServer;
/**
 * orderBy: Sort order - https://cloud.google.com/apis/design/design_patterns#list_pagination
 *  the order-by name should be exactly match the keys of the QueryFilter interface
 *
 * The rootId & parentId: when they are `undefined`, there have two cases:
 *
 *  1. `'rootId' in options === false`
 *    in this case, we do not filter `rootId` at all
 *
 *  2. `'rootId' in options === true`
 *    in this case, we filter `rootId` as `undefined`, which means that the post must be the root node
 *
 */
interface PostQueryFilter {
    contactId?: string;
    id?: string;
    orderBy?: string;
    parentId?: string;
    rootId?: string;
    type?: PostType;
}
export { isPostPayloadClient, isPostPayloadServer, PostType, type PostQueryFilter, type SayablePayloadPost, type PostPayload, type PostPayloadClient, type PostPayloadServer, };
