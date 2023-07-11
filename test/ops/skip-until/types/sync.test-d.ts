import {expectType} from 'tsd';

import {pipe, skipUntil, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    skipUntil((value) => true),
);
expectType<IterableExt<number>>(test1);
