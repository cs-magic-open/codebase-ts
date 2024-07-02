import QuickLru from '@alloc/quick-lru';
import type { ContactPayload } from '../schemas/contact.js';
import type { FriendshipPayload } from '../schemas/friendship.js';
import type { MessagePayload } from '../schemas/message.js';
import type { RoomMemberPayload, RoomPayload } from '../schemas/room.js';
import type { RoomInvitationPayload } from '../schemas/room-invitation.js';
import type { PuppetOptions } from '../schemas/puppet.js';
import type { PostPayload } from '../schemas/post.js';
type PayloadCacheOptions = Required<PuppetOptions>['cache'];
interface LruRoomMemberPayload {
    [memberContactId: string]: RoomMemberPayload;
}
declare class CacheAgent {
    protected options?: {
        contact?: number | undefined;
        friendship?: number | undefined;
        message?: number | undefined;
        post?: number | undefined;
        room?: number | undefined;
        roomInvitation?: number | undefined;
        roomMember?: number | undefined;
    } | undefined;
    readonly contact: QuickLru<string, ContactPayload>;
    readonly friendship: QuickLru<string, FriendshipPayload>;
    readonly message: QuickLru<string, MessagePayload>;
    readonly post: QuickLru<string, PostPayload>;
    readonly room: QuickLru<string, RoomPayload>;
    readonly roomInvitation: QuickLru<string, RoomInvitationPayload>;
    readonly roomMember: QuickLru<string, LruRoomMemberPayload>;
    constructor(options?: {
        contact?: number | undefined;
        friendship?: number | undefined;
        message?: number | undefined;
        post?: number | undefined;
        room?: number | undefined;
        roomInvitation?: number | undefined;
        roomMember?: number | undefined;
    } | undefined);
    start(): void;
    stop(): void;
    /**
     * FIXME: Huan(202008) clear cache when stop
     *  keep the cache as a temp workaround since wechaty-puppet-service has reconnect issue
     *  with un-cleared cache in wechaty-puppet will make the reconnect recoverable
     *
     * Related issue: https://github.com/wechaty/wechaty-puppet-service/issues/31
     *
     * Update:
     *  Huan(2021-08-28): clear the cache when stop
     */
    clear(): void;
}
export type { PayloadCacheOptions };
export { CacheAgent };
