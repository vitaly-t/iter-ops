import {expectType} from 'tsd';

import {type AsyncIterableExt, every, pipe} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    every((a) => a > 5)
);
expectType<AsyncIterableExt<boolean>>(test1);
