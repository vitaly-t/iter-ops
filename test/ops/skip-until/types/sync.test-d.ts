import {expectType} from 'tsd';

import type {IterableExt} from '../../../../src';
import {pipe, skipUntil} from '../../../../src/entry/sync';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(
    iterableNumber,
    skipUntil((value) => true)
);
expectType<IterableExt<number>>(test1);
