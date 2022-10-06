import {expectType} from 'tsd';

import {reduce, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<Iterable<number>>;

const test1 = pipeAsync(
    iterableNumber,
    reduce(() => 'foo')
);
expectType<AsyncIterableExt<string>>(test1);
