import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {spread, pipe} from '../../../../src/entry/async';

declare const iterable1: AsyncIterable<AsyncIterable<number>>;
declare const iterable2: AsyncIterable<Iterable<number>>;
declare const iterable3: AsyncIterable<
    AsyncIterable<number> | Iterable<string>
>;

const test1 = pipe(iterable1, spread());
expectType<AsyncIterableExt<number>>(test1);

const test2 = pipe(iterable2, spread());
expectType<AsyncIterableExt<number>>(test2);

const test3 = pipe(iterable3, spread());
expectType<AsyncIterableExt<number | string>>(test3);
