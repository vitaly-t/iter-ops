import {expectType} from 'tsd';

import {type AsyncIterableExt, map, pipe} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    map((value) => 'foo')
);
expectType<AsyncIterableExt<string>>(test1);
