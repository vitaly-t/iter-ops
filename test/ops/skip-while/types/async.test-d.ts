import {expectType} from 'tsd';

import {pipe, skipWhile, type AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    skipWhile((value) => true)
);
expectType<AsyncIterableExt<number>>(test1);
