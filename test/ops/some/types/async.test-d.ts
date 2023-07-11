import {expectType} from 'tsd';

import {some, pipe, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    some((value) => true),
);
expectType<AsyncIterableExt<boolean>>(test1);
