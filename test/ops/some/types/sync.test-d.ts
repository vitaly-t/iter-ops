import {expectType} from 'tsd';

import {some, pipe, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    some((value) => true),
);
expectType<IterableExt<boolean>>(test1);
