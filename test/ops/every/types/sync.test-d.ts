import {expectType} from 'tsd';

import {every, IterableExt, pipe} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    every((a) => a > 5),
);
expectType<IterableExt<boolean>>(test1);
