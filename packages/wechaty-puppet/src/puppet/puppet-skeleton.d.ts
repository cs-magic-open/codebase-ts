import type { WrapAsync } from 'gerror';
import type { PuppetOptions } from '../schemas/puppet.js';
import { PuppetEventEmitter } from './events.js';
declare abstract class PuppetSkeleton extends PuppetEventEmitter {
    /**
     * Puppet ID (UUID)
     *
     * Issue #160 - puppet.id will change to puppet.loggedInUserId #160
     *  - `id` is NOT logged in user ID
     *  - `currentUserId` is the logged in user ID
     *  @see https://github.com/wechaty/puppet/issues/160
     */
    readonly id: string;
    readonly options: PuppetOptions;
    /**
     * Wrap promise in sync way (catch error by emitting it)
     *  1. convert a async callback function to be sync function
     *    by catcing any errors and emit them to error event
     *  2. wrap a Promise by catcing any errors and emit them to error event
     */
    wrapAsync: WrapAsync;
    /**
     * Huan(202110): keep constructor with `args: any[]` parameters
     *  because mixins required it
     *
     * We will save args[0] to `this.options` so that all mixins can access it
     * @param args
     */
    constructor(...args: any[]);
    /**
     * Huan(202110): Issue #156 - https://github.com/wechaty/puppet/issues/156
     *
     *  All mixins should implemente both `start()` and `stop()`,
     *  and they must call `super.start()` and `super.stop()`
     *  so that all start()/stop() calls can be chained through all mixins.
     */
    start(): Promise<void>;
    stop(): Promise<void>;
    /**
     * Convert any error payload to GError ,
     *  and re-emit a `error` event with EventErrorPayload(GError)
     */
    emit(event: any, ...args: any): boolean;
}
type PuppetSkeletonProtectedProperty = never;
export type { PuppetSkeletonProtectedProperty, };
export { PuppetSkeleton };
