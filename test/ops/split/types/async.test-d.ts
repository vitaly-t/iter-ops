import {expectType} from 'tsd';

import {split, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(
    iterableNumber,
    split((value) => true)
);
expectType<AsyncIterableExt<number[]>>(test1);
