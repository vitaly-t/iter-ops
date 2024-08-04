import {expectType} from 'tsd';

import {timing, pipe, type AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    timing(() => {})
);
expectType<AsyncIterableExt<number>>(test1);
