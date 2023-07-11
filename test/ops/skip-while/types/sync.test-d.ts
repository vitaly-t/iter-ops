import {expectType} from 'tsd';

import {pipe, skipWhile, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    skipWhile((value) => true),
);
expectType<IterableExt<number>>(test1);
