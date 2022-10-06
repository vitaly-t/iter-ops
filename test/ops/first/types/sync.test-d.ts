import {expectType} from 'tsd';

import {first, IterableExt, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

expectType<IterableExt<number>>(pipeSync(iterableNumber, first()));

const test1 = pipeSync(
    iterableNumber,
    first((a) => a > 5)
);
expectType<IterableExt<number>>(test1);
