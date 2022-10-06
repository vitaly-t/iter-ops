import {expectType} from 'tsd';

import {AsyncIterableExt, first, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

expectType<AsyncIterableExt<number>>(pipeAsync(iterableNumber, first()));

const test1 = pipeAsync(
    iterableNumber,
    first((a) => a > 5)
);
expectType<AsyncIterableExt<number>>(test1);
