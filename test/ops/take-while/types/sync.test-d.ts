import {expectType} from 'tsd';

import {pipe, takeWhile, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    takeWhile((value) => true),
);
expectType<IterableExt<number>>(test1);
