import {expectType} from 'tsd';

import {AsyncIterableExt, last, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(iterableNumber, last());
expectType<AsyncIterableExt<number>>(test1);

const test2 = pipeAsync(
    iterableNumber,
    last((value, index) => true)
);
expectType<AsyncIterableExt<number>>(test2);
