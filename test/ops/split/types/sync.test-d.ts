import {expectType} from 'tsd';

import {split, pipeSync, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(
    iterableNumber,
    split((value) => true)
);
expectType<IterableExt<number[]>>(test1);
