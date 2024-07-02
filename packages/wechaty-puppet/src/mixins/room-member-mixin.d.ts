import type { ContactQueryFilter } from '../schemas/contact.js';
import type { RoomMemberPayload, RoomMemberQueryFilter } from '../schemas/room.js';
import type { PuppetSkeleton } from '../puppet/puppet-skeleton.js';
import { DirtyType } from '../schemas/dirty.js';
declare const roomMemberMixin: <MixinBase extends typeof PuppetSkeleton & (abstract new (...args: any[]) => {
    contactSelfName(name: string): Promise<void>;
    contactSelfQRCode(): Promise<string>;
    contactSelfSignature(signature: string): Promise<void>;
    contactAlias(contactId: string): Promise<string>;
    contactAlias(contactId: string, alias: string | null): Promise<void>;
    contactAvatar(contactId: string): Promise<import("file-box").FileBoxInterface>;
    contactAvatar(contactId: string, file: import("file-box").FileBoxInterface): Promise<void>;
    contactPhone(contactId: string, phoneList: string[]): Promise<void>;
    contactCorporationRemark(contactId: string, corporationRemark: string | null): Promise<void>;
    contactDescription(contactId: string, description: string | null): Promise<void>;
    contactList(): Promise<string[]>; /**
     * Huan(202111): We use `symbol` instead of `uniq symbol` in the method argument
     *  so that the interface code can be compatible with different npm modules.
     *
     * i.e. in Wechaty docker, sometimes there will be `/wechaty/node_modules/wechaty-puppet`
     *  and the `/bot/node_modules/wechaty-puppet` two different npm modules installed together,
     *  and cause conflict if we use `uniq symbol` to check the symbol type.
     */
    contactRawPayload(contactId: string): Promise<any>;
    contactRawPayloadParser(rawPayload: any): Promise<import("../schemas/contact.js").ContactPayload>;
    contactSearch(query?: string | ContactQueryFilter | undefined, searchIdList?: string[] | undefined): Promise<string[]>;
    contactQueryFilterFactory(query: ContactQueryFilter): import("../schemas/contact.js").ContactPayloadFilterFunction;
    contactValidate(contactId: string): Promise<boolean>;
    contactPayloadCache(contactId: string): import("../schemas/contact.js").ContactPayload | undefined;
    contactPayload(contactId: string): Promise<import("../schemas/contact.js").ContactPayload>;
    contactPayloadDirty(id: string): Promise<void>;
    cache: import("../agents/cache-agent.js").CacheAgent;
    __cacheMixinCleanCallbackList: (() => void)[];
    start: (() => Promise<void>) & (() => Promise<void>) & (() => Promise<void>);
    stop: (() => Promise<void>) & (() => Promise<void>) & (() => Promise<void>);
    dirtyPayload(type: DirtyType, id: string): void;
    onDirty({ payloadType, payloadId, }: import("../schemas/event.js").EventDirtyPayload): void;
    __dirtyPayloadAwait(type: DirtyType, id: string): Promise<void>;
    readonly id: string;
    readonly options: import("../schemas/puppet.js").PuppetOptions;
    wrapAsync: import("gerror").WrapAsync;
    emit(event: any, ...args: any): boolean;
    addListener<E extends keyof import("../puppet/events.js").PuppetEventListener>(event: E, listener: import("../puppet/events.js").PuppetEventListener[E]): any;
    on<E_1 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_1, listener: import("../puppet/events.js").PuppetEventListener[E_1]): any;
    once<E_2 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_2, listener: import("../puppet/events.js").PuppetEventListener[E_2]): any;
    prependListener<E_3 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_3, listener: import("../puppet/events.js").PuppetEventListener[E_3]): any;
    prependOnceListener<E_4 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_4, listener: import("../puppet/events.js").PuppetEventListener[E_4]): any;
    off<E_5 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_5, listener: import("../puppet/events.js").PuppetEventListener[E_5]): any;
    removeAllListeners<E_6 extends keyof import("../puppet/events.js").PuppetEventListener>(event?: E_6 | undefined): any;
    removeListener<E_7 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_7, listener: import("../puppet/events.js").PuppetEventListener[E_7]): any;
    eventNames(): (string | symbol)[];
    rawListeners<E_8 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_8): Function[];
    listeners<E_9 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_9): Function[];
    listenerCount<E_10 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_10): number;
    getMaxListeners(): number; /**
      * 0. for YOU: 'You', '你' in sys message
      */
    setMaxListeners(maxListeners: number): any;
    __events: import("../puppet/events.js").PuppetEventListener;
    __currentUserId?: string | undefined;
    readonly currentUserId: string;
    readonly isLoggedIn: boolean;
    __authQrCode?: string | undefined;
    readonly authQrCode: string | undefined;
    login(userId: string): void;
    logout(reason?: string): Promise<void>;
    selfId(): string;
    logonoff(): boolean;
}) & (abstract new (...args: any[]) => {
    cache: import("../agents/cache-agent.js").CacheAgent;
    __cacheMixinCleanCallbackList: (() => void)[];
    start(): Promise<void>;
    stop(): Promise<void>;
    dirtyPayload(type: DirtyType, id: string): void;
    onDirty({ payloadType, payloadId, }: import("../schemas/event.js").EventDirtyPayload): void;
    __dirtyPayloadAwait(type: DirtyType, id: string): Promise<void>;
    readonly id: string;
    readonly options: import("../schemas/puppet.js").PuppetOptions;
    wrapAsync: import("gerror").WrapAsync;
    emit(event: any, ...args: any): boolean;
    addListener<E_11 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_11, listener: import("../puppet/events.js").PuppetEventListener[E_11]): any;
    on<E_12 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_12, listener: import("../puppet/events.js").PuppetEventListener[E_12]): any;
    once<E_13 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_13, listener: import("../puppet/events.js").PuppetEventListener[E_13]): any;
    prependListener<E_14 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_14, listener: import("../puppet/events.js").PuppetEventListener[E_14]): any;
    prependOnceListener<E_15 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_15, listener: import("../puppet/events.js").PuppetEventListener[E_15]): any;
    off<E_16 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_16, listener: import("../puppet/events.js").PuppetEventListener[E_16]): any;
    removeAllListeners<E_17 extends keyof import("../puppet/events.js").PuppetEventListener>(event?: E_17 | undefined): any;
    removeListener<E_18 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_18, listener: import("../puppet/events.js").PuppetEventListener[E_18]): any;
    eventNames(): (string | symbol)[];
    rawListeners<E_8 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_8): Function[];
    listeners<E_9 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_9): Function[];
    listenerCount<E_10 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_10): number;
    getMaxListeners(): number; /**
      * 0. for YOU: 'You', '你' in sys message
      */
    setMaxListeners(maxListeners: number): any;
    __events: import("../puppet/events.js").PuppetEventListener;
    __currentUserId?: string | undefined;
    readonly currentUserId: string;
    readonly isLoggedIn: boolean;
    __authQrCode?: string | undefined;
    readonly authQrCode: string | undefined;
    login(userId: string): void;
    logout(reason?: string): Promise<void>;
    selfId(): string;
    logonoff(): boolean;
}) & (abstract new (...args: any[]) => {
    __currentUserId?: string | undefined;
    readonly currentUserId: string;
    readonly isLoggedIn: boolean;
    __authQrCode?: string | undefined;
    readonly authQrCode: string | undefined;
    start(): Promise<void>;
    stop(): Promise<void>;
    login(userId: string): void;
    logout(reason?: string): Promise<void>;
    selfId(): string;
    logonoff(): boolean;
    readonly id: string;
    readonly options: import("../schemas/puppet.js").PuppetOptions;
    wrapAsync: import("gerror").WrapAsync;
    emit(event: any, ...args: any): boolean;
    addListener<E_19 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_19, listener: import("../puppet/events.js").PuppetEventListener[E_19]): any;
    on<E_20 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_20, listener: import("../puppet/events.js").PuppetEventListener[E_20]): any;
    once<E_21 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_21, listener: import("../puppet/events.js").PuppetEventListener[E_21]): any;
    prependListener<E_22 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_22, listener: import("../puppet/events.js").PuppetEventListener[E_22]): any;
    prependOnceListener<E_23 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_23, listener: import("../puppet/events.js").PuppetEventListener[E_23]): any;
    off<E_24 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_24, listener: import("../puppet/events.js").PuppetEventListener[E_24]): any;
    removeAllListeners<E_25 extends keyof import("../puppet/events.js").PuppetEventListener>(event?: E_25 | undefined): any;
    removeListener<E_26 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_26, listener: import("../puppet/events.js").PuppetEventListener[E_26]): any;
    eventNames(): (string | symbol)[];
    rawListeners<E_8 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_8): Function[];
    listeners<E_9 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_9): Function[];
    listenerCount<E_10 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_10): number;
    getMaxListeners(): number; /**
      * 0. for YOU: 'You', '你' in sys message
      */
    setMaxListeners(maxListeners: number): any;
    __events: import("../puppet/events.js").PuppetEventListener;
})>(mixinBase: MixinBase) => (abstract new (...args: any[]) => {
    roomMemberList(roomId: string): Promise<string[]>;
    /** @protected */
    roomMemberRawPayload(roomId: string, contactId: string): Promise<any>;
    /** @protected */
    roomMemberRawPayloadParser(rawPayload: any): Promise<RoomMemberPayload>;
    roomMemberSearch(roomId: string, query: (symbol | string) | RoomMemberQueryFilter, memberIdList?: string[]): Promise<string[]>;
    roomMemberPayload(roomId: string, memberId: string): Promise<RoomMemberPayload>;
    roomMemberPayloadDirty(id: string): Promise<void>;
    readonly id: string;
    readonly options: import("../schemas/puppet.js").PuppetOptions;
    wrapAsync: import("gerror").WrapAsync;
    start: (() => Promise<void>) & (() => Promise<void>) & (() => Promise<void>);
    stop: (() => Promise<void>) & (() => Promise<void>) & (() => Promise<void>);
    emit(event: any, ...args: any): boolean;
    addListener<E_27 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_27, listener: import("../puppet/events.js").PuppetEventListener[E_27]): any;
    on<E_28 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_28, listener: import("../puppet/events.js").PuppetEventListener[E_28]): any;
    once<E_29 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_29, listener: import("../puppet/events.js").PuppetEventListener[E_29]): any;
    prependListener<E_30 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_30, listener: import("../puppet/events.js").PuppetEventListener[E_30]): any;
    prependOnceListener<E_31 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_31, listener: import("../puppet/events.js").PuppetEventListener[E_31]): any;
    off<E_32 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_32, listener: import("../puppet/events.js").PuppetEventListener[E_32]): any;
    removeAllListeners<E_33 extends keyof import("../puppet/events.js").PuppetEventListener>(event?: E_33 | undefined): any;
    removeListener<E_34 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_34, listener: import("../puppet/events.js").PuppetEventListener[E_34]): any;
    eventNames(): (string | symbol)[];
    rawListeners<E_8 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_8): Function[];
    listeners<E_9 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_9): Function[];
    listenerCount<E_10 extends keyof import("../puppet/events.js").PuppetEventListener>(event: E_10): number;
    getMaxListeners(): number; /**
      * 0. for YOU: 'You', '你' in sys message
      */
    setMaxListeners(maxListeners: number): any;
    __events: import("../puppet/events.js").PuppetEventListener;
    contactSelfName(name: string): Promise<void>;
    contactSelfQRCode(): Promise<string>;
    contactSelfSignature(signature: string): Promise<void>;
    contactAlias(contactId: string): Promise<string>;
    contactAlias(contactId: string, alias: string | null): Promise<void>;
    contactAvatar(contactId: string): Promise<import("file-box").FileBoxInterface>;
    contactAvatar(contactId: string, file: import("file-box").FileBoxInterface): Promise<void>;
    contactPhone(contactId: string, phoneList: string[]): Promise<void>;
    contactCorporationRemark(contactId: string, corporationRemark: string | null): Promise<void>;
    contactDescription(contactId: string, description: string | null): Promise<void>;
    contactList(): Promise<string[]>; /**
     * Huan(202111): We use `symbol` instead of `uniq symbol` in the method argument
     *  so that the interface code can be compatible with different npm modules.
     *
     * i.e. in Wechaty docker, sometimes there will be `/wechaty/node_modules/wechaty-puppet`
     *  and the `/bot/node_modules/wechaty-puppet` two different npm modules installed together,
     *  and cause conflict if we use `uniq symbol` to check the symbol type.
     */
    contactRawPayload(contactId: string): Promise<any>;
    contactRawPayloadParser(rawPayload: any): Promise<import("../schemas/contact.js").ContactPayload>;
    contactSearch(query?: string | ContactQueryFilter | undefined, searchIdList?: string[] | undefined): Promise<string[]>;
    contactQueryFilterFactory(query: ContactQueryFilter): import("../schemas/contact.js").ContactPayloadFilterFunction;
    contactValidate(contactId: string): Promise<boolean>;
    contactPayloadCache(contactId: string): import("../schemas/contact.js").ContactPayload | undefined;
    contactPayload(contactId: string): Promise<import("../schemas/contact.js").ContactPayload>;
    contactPayloadDirty(id: string): Promise<void>;
    cache: import("../agents/cache-agent.js").CacheAgent;
    __cacheMixinCleanCallbackList: (() => void)[];
    dirtyPayload(type: DirtyType, id: string): void;
    onDirty({ payloadType, payloadId, }: import("../schemas/event.js").EventDirtyPayload): void;
    __dirtyPayloadAwait(type: DirtyType, id: string): Promise<void>;
    __currentUserId?: string | undefined;
    readonly currentUserId: string;
    readonly isLoggedIn: boolean;
    __authQrCode?: string | undefined;
    readonly authQrCode: string | undefined;
    login(userId: string): void;
    logout(reason?: string): Promise<void>;
    selfId(): string;
    logonoff(): boolean;
}) & MixinBase;
type RoomMemberMixin = ReturnType<typeof roomMemberMixin>;
type ProtectedPropertyRoomMemberMixin = 'roomMemberRawPayload' | 'roomMemberRawPayloadParser';
export type { ProtectedPropertyRoomMemberMixin, RoomMemberMixin, };
export { roomMemberMixin };
