import {expectType} from 'tsd';

import {some, pipeSync, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(
    iterableNumber,
    some((value) => true)
);
expectType<IterableExt<boolean>>(test1);
