import { Puppet } from './puppet-abstract.js';
import type { PuppetInterface } from './puppet-interface.js';
declare const interfaceOfPuppet: (target: any) => target is PuppetInterface;
declare const looseInstanceOfPuppet: (target: any) => target is Puppet;
export { interfaceOfPuppet, looseInstanceOfPuppet, };
