import {expectType} from 'tsd';

import {stop, pipe, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    stop((value) => true)
);
expectType<AsyncIterableExt<number>>(test1);
