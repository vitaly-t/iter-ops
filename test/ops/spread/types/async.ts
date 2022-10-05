import {spread, pipeAsync} from '../../../../src';

declare const iterable1: AsyncIterable<AsyncIterable<number>>;
declare const iterable2: AsyncIterable<Iterable<number>>;
declare const iterable3: AsyncIterable<
    AsyncIterable<number> | Iterable<string>
>;

// $ExpectType AsyncIterableExt<number>
pipeAsync(iterable1, spread());

// $ExpectType AsyncIterableExt<number>
pipeAsync(iterable2, spread());

// $ExpectType AsyncIterableExt<number | string>
pipeAsync(iterable3, spread());
