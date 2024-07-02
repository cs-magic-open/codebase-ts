import type { PuppetOptions } from '../schemas/puppet.js';
import type { PuppetInterface, PuppetConstructor } from './puppet-interface.js';
type PuppetNpmScope = `@${string}/` | '';
type PuppetNpmName = `${PuppetNpmScope}wechaty-puppet-${string}`;
interface ResolveOptions {
    puppet: PuppetNpmName | PuppetInterface;
    puppetOptions?: PuppetOptions;
}
declare function resolvePuppet(options: ResolveOptions): Promise<PuppetInterface>;
declare function resolvePuppetName(puppetName: PuppetNpmName): Promise<PuppetConstructor>;
export { resolvePuppet, resolvePuppetName, };
