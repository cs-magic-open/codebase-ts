import { Watchdog } from 'watchdog';
import type { PuppetSkeleton } from '../puppet/mod.js';
import type { ServiceMixin } from '../mixins/service-mixin.js';
declare class WatchdogAgent {
    protected readonly puppet: PuppetSkeleton & InstanceType<ServiceMixin>;
    protected readonly watchdog: Watchdog;
    private cleanCallbackList;
    constructor(puppet: PuppetSkeleton & InstanceType<ServiceMixin>);
    start(): void;
    stop(): void;
}
export { WatchdogAgent };
