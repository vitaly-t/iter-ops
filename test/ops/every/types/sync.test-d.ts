import {expectType} from 'tsd';

import {every, IterableExt, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(
    iterableNumber,
    every((a) => a > 5)
);
expectType<IterableExt<boolean>>(test1);
