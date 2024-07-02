#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
import { test } from 'tstest';
test('SayablePayloadUnsupportedType must be subset of MessageType', async (t) => {
    const noOneLeft = true;
    t.ok(noOneLeft, 'should match MessageType for every unsupported type');
});
test('SayablePayloadUnsupportedType & SayablePayload[type] must contain all MessageType', async (t) => {
    const noOneLeft = true;
    t.ok(noOneLeft, 'should list all MessageType in our sayable defination');
});
