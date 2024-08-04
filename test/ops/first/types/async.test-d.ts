import {expectType} from 'tsd';

import {type AsyncIterableExt, first, pipe} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

expectType<AsyncIterableExt<number>>(pipe(iterableNumber, first()));

const test1 = pipe(
    iterableNumber,
    first((a) => a > 5)
);
expectType<AsyncIterableExt<number>>(test1);
