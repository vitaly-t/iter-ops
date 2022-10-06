import {expectType} from 'tsd';

import {filter, IterableExt, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(
    iterableNumber,
    filter((a) => a > 5)
);
expectType<IterableExt<number>>(test1);
