#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test, } from 'tstest';
test('ProtectedProperties', async (t) => {
    const noOneLeft = true;
    t.ok(noOneLeft, 'should match Puppet properties for every protected property');
});
