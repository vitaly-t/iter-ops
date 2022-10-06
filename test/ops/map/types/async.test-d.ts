import {expectType} from 'tsd';

import {AsyncIterableExt, map, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(
    iterableNumber,
    map((value) => 'foo')
);
expectType<AsyncIterableExt<string>>(test1);
