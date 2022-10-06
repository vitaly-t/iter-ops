import {expectType} from 'tsd';

import {AsyncIterableExt, every, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(
    iterableNumber,
    every((a) => a > 5)
);
expectType<AsyncIterableExt<boolean>>(test1);
