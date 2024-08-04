import {expectType} from 'tsd';

import {pipe, takeUntil, type IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    takeUntil((value) => true)
);
expectType<IterableExt<number>>(test1);
