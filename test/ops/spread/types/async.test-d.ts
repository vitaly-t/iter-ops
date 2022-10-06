import {expectType} from 'tsd';

import {spread, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterable1: AsyncIterable<AsyncIterable<number>>;
declare const iterable2: AsyncIterable<Iterable<number>>;
declare const iterable3: AsyncIterable<
    AsyncIterable<number> | Iterable<string>
>;

const test1 = pipeAsync(iterable1, spread());
expectType<AsyncIterableExt<number>>(test1);

const test2 = pipeAsync(iterable2, spread());
expectType<AsyncIterableExt<number>>(test2);

const test3 = pipeAsync(iterable3, spread());
expectType<AsyncIterableExt<number | string>>(test3);
