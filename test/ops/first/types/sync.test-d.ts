import {expectType} from 'tsd';

import {first, type IterableExt, pipe} from '../../../../src';

declare const iterableNumber: Iterable<number>;

expectType<IterableExt<number>>(pipe(iterableNumber, first()));

const test1 = pipe(
    iterableNumber,
    first((a) => a > 5)
);
expectType<IterableExt<number>>(test1);
