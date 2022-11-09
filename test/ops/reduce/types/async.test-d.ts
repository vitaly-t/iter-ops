import {expectType} from 'tsd';

import {reduce, pipe, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<Iterable<number>>;

const test1 = pipe(
    iterableNumber,
    reduce(() => 'foo')
);
expectType<AsyncIterableExt<string>>(test1);
