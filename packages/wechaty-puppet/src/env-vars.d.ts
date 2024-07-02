/// <reference types="node" />
/// <reference types="node" />
declare const getNumberEnv: (env: typeof process.env) => (varName: string, defaultValue: number) => number;
declare const WECHATY_PUPPET_LRU_CACHE_SIZE_CONTACT: (v?: number) => number;
declare const WECHATY_PUPPET_LRU_CACHE_SIZE_FRIENDSHIP: (v?: number) => number;
declare const WECHATY_PUPPET_LRU_CACHE_SIZE_MESSAGE: (v?: number) => number;
declare const WECHATY_PUPPET_LRU_CACHE_SIZE_POST: (v?: number) => number;
declare const WECHATY_PUPPET_LRU_CACHE_SIZE_ROOM: (v?: number) => number;
declare const WECHATY_PUPPET_LRU_CACHE_SIZE_ROOM_INVITATION: (v?: number) => number;
declare const WECHATY_PUPPET_LRU_CACHE_SIZE_ROOM_MEMBER: (v?: number) => number;
export { getNumberEnv, WECHATY_PUPPET_LRU_CACHE_SIZE_CONTACT, WECHATY_PUPPET_LRU_CACHE_SIZE_FRIENDSHIP, WECHATY_PUPPET_LRU_CACHE_SIZE_MESSAGE, WECHATY_PUPPET_LRU_CACHE_SIZE_POST, WECHATY_PUPPET_LRU_CACHE_SIZE_ROOM_INVITATION, WECHATY_PUPPET_LRU_CACHE_SIZE_ROOM_MEMBER, WECHATY_PUPPET_LRU_CACHE_SIZE_ROOM, };
