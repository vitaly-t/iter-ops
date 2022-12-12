import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {pipe, takeUntil} from '../../../../src/entry/async';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    takeUntil((value) => true)
);
expectType<AsyncIterableExt<number>>(test1);
