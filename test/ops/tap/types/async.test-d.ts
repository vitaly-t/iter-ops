import {expectType} from 'tsd';

import {tap, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(
    iterableNumber,
    tap(() => {})
);
expectType<AsyncIterableExt<number>>(test1);
