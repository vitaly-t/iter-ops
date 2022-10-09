import {expectType} from 'tsd';

import {AsyncIterableExt, flat, pipe} from '../../../../src';

declare const iterable1: AsyncIterable<AsyncIterable<number>>;
declare const iterable2: AsyncIterable<Iterable<number>>;
declare const iterable3: AsyncIterable<
    AsyncIterable<number> | Iterable<string>
>;

const test1 = pipe(iterable1, flat());
expectType<AsyncIterableExt<number>>(test1);

const test2 = pipe(iterable2, flat());
expectType<AsyncIterableExt<number>>(test2);

const test3 = pipe(iterable3, flat());
expectType<AsyncIterableExt<number | string>>(test3);
