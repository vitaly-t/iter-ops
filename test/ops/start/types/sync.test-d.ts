import {expectType} from 'tsd';

import {start, pipe, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    start((value) => true)
);
expectType<IterableExt<number>>(test1);
