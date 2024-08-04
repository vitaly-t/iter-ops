import {expectType} from 'tsd';

import {pipe, takeUntil, type AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    takeUntil((value) => true)
);
expectType<AsyncIterableExt<number>>(test1);
