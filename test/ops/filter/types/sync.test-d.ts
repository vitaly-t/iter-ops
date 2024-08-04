import {expectType} from 'tsd';

import {filter, type IterableExt, pipe} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    filter((a) => a > 5)
);
expectType<IterableExt<number>>(test1);
