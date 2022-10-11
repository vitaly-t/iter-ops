import {expectType} from 'tsd';

import {start, pipe, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    start((value) => true)
);
expectType<AsyncIterableExt<number>>(test1);
