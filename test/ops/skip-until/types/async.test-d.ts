import {expectType} from 'tsd';

import {pipe, skipUntil, type AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    skipUntil((value) => true)
);
expectType<AsyncIterableExt<number>>(test1);
