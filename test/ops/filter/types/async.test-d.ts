import {expectType} from 'tsd';

import {AsyncIterableExt, filter, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(
    iterableNumber,
    filter((a) => a > 5)
);
expectType<AsyncIterableExt<number>>(test1);
