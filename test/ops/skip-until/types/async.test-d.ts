import {expectType} from 'tsd';

import {pipe, skipUntil, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    skipUntil((value) => true)
);
expectType<AsyncIterableExt<number>>(test1);
