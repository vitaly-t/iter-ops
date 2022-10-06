import {expectType} from 'tsd';

import {timing, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(
    iterableNumber,
    timing(() => {})
);
expectType<AsyncIterableExt<number>>(test1);
