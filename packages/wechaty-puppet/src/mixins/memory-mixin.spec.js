#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test, } from 'tstest';
import { PuppetSkeleton } from '../puppet/puppet-skeleton.js';
import { memoryMixin, } from './memory-mixin.js';
test('ProtectedPropertyMemoryMixin', async (t) => {
    const noOneLeft = true;
    t.ok(noOneLeft, 'should match Mixin properties for every protected property');
});
test('MemoryMixin', async (t) => {
    const Test = class extends memoryMixin(PuppetSkeleton) {
    };
    const test = new Test();
    t.ok(test.memory, 'should has memory');
    t.notOk(test.memory.name, 'should has no memory name');
    const memoryGet = () => test.memory.get('test');
    await t.rejects(memoryGet, 'should reject get() before memory.load()');
    await test.start();
    await t.resolves(memoryGet, 'should resolve get() after memory.load()');
});
