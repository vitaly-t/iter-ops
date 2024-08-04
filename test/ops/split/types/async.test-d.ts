import {expectType} from 'tsd';

import {split, pipe, type AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    split((value) => true)
);
expectType<AsyncIterableExt<number[]>>(test1);
