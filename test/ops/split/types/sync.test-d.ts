import {expectType} from 'tsd';

import {split, pipe, type IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    split((value) => true)
);
expectType<IterableExt<number[]>>(test1);
