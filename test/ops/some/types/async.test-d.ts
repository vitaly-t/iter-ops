import {expectType} from 'tsd';

import {some, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(
    iterableNumber,
    some((value) => true)
);
expectType<AsyncIterableExt<boolean>>(test1);
