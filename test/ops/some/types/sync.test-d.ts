import {expectType} from 'tsd';

import type {IterableExt} from '../../../../src';
import {some, pipe} from '../../../../src/entry/sync';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    some((value) => true)
);
expectType<IterableExt<boolean>>(test1);
