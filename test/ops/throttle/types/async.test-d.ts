import {expectType} from 'tsd';

import {throttle, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(
    iterableNumber,
    throttle(async () => {})
);
expectType<AsyncIterableExt<number>>(test1);
