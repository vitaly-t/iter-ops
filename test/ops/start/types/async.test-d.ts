import {expectType} from 'tsd';

import {start, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(
    iterableNumber,
    start((value) => true)
);
expectType<AsyncIterableExt<number>>(test1);
