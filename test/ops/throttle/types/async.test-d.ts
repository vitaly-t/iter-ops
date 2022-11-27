import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {throttle, pipe} from '../../../../src/entry/async';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    throttle(async () => {})
);
expectType<AsyncIterableExt<number>>(test1);
