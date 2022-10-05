import {flat, pipeAsync} from '../../../../src';

declare const iterable1: AsyncIterable<AsyncIterable<number>>;
declare const iterable2: AsyncIterable<Iterable<number>>;
declare const iterable3: AsyncIterable<
    AsyncIterable<number> | Iterable<string>
>;

// $ExpectType AsyncIterableExt<number>
pipeAsync(iterable1, flat());

// $ExpectType AsyncIterableExt<number>
pipeAsync(iterable2, flat());

// $ExpectType AsyncIterableExt<number | string>
pipeAsync(iterable3, flat());
