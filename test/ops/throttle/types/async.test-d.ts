import {expectType} from 'tsd';

import {throttle, pipe, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    throttle(async () => {}),
);
expectType<AsyncIterableExt<number>>(test1);
