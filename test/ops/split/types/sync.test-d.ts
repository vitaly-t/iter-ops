import {expectType} from 'tsd';

import type {IterableExt} from '../../../../src';
import {split, pipe} from '../../../../src/entry/sync';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    split((value) => true)
);
expectType<IterableExt<number[]>>(test1);
