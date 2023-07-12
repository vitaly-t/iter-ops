import {expectType} from 'tsd';

import {pipe, takeWhile, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    takeWhile((value) => true)
);
expectType<AsyncIterableExt<number>>(test1);
