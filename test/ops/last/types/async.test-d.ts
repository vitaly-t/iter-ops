import {expectType} from 'tsd';

import {AsyncIterableExt, last, pipe} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(iterableNumber, last());
expectType<AsyncIterableExt<number>>(test1);

const test2 = pipe(
    iterableNumber,
    last((value, index) => true)
);
expectType<AsyncIterableExt<number>>(test2);
