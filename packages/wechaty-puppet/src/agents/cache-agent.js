import QuickLru from '@alloc/quick-lru';
import { envVars, log, } from '../config.js';
class CacheAgent {
    options;
    contact;
    friendship;
    message;
    post;
    room;
    roomInvitation;
    roomMember;
    constructor(options) {
        this.options = options;
        log.verbose('PuppetCacheAgent', 'constructor(%s)', options
            ? JSON.stringify(options)
            : '');
        /**
         * Setup LRU Caches
         */
        const lruOptions = (maxSize = 100) => ({
            maxAge: 15 * 60 * 1000 * 1000, // 15 minutes
            maxSize,
        });
        this.contact = new QuickLru(lruOptions(envVars.WECHATY_PUPPET_LRU_CACHE_SIZE_CONTACT(options?.contact)));
        this.friendship = new QuickLru(lruOptions(envVars.WECHATY_PUPPET_LRU_CACHE_SIZE_FRIENDSHIP(options?.friendship)));
        this.message = new QuickLru(lruOptions(envVars.WECHATY_PUPPET_LRU_CACHE_SIZE_MESSAGE(options?.message)));
        this.roomInvitation = new QuickLru(lruOptions(envVars.WECHATY_PUPPET_LRU_CACHE_SIZE_ROOM_INVITATION(options?.roomInvitation)));
        this.roomMember = new QuickLru(lruOptions(envVars.WECHATY_PUPPET_LRU_CACHE_SIZE_ROOM_MEMBER(options?.roomMember)));
        this.room = new QuickLru(lruOptions(envVars.WECHATY_PUPPET_LRU_CACHE_SIZE_ROOM(options?.room)));
        this.post = new QuickLru(lruOptions(envVars.WECHATY_PUPPET_LRU_CACHE_SIZE_POST(options?.post)));
    }
    start() {
        log.verbose('PuppetCacheAgent', 'start()');
    }
    stop() {
        log.verbose('PuppetCacheAgent', 'stop()');
        this.clear();
    }
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
    clear() {
        log.verbose('PuppetCacheAgent', 'clear()');
        this.contact.clear();
        this.friendship.clear();
        this.message.clear();
        this.post.clear();
        this.room.clear();
        this.roomInvitation.clear();
        this.roomMember.clear();
    }
}
export { CacheAgent };
