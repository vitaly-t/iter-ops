import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {timing, pipe} from '../../../../src/entry/async';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    timing(() => {})
);
expectType<AsyncIterableExt<number>>(test1);
