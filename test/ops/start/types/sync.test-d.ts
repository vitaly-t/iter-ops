import {expectType} from 'tsd';

import {start, pipeSync, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(
    iterableNumber,
    start((value) => true)
);
expectType<IterableExt<number>>(test1);
