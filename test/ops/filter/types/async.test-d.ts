import {expectType} from 'tsd';

import {AsyncIterableExt, filter, pipe} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    filter((a) => a > 5),
);
expectType<AsyncIterableExt<number>>(test1);
