import {expectType} from 'tsd';

import {stop, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(
    iterableNumber,
    stop((value) => true)
);
expectType<AsyncIterableExt<number>>(test1);
