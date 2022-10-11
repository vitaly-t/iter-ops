import {expectType} from 'tsd';

import {AsyncIterableExt, flatMap, pipeAsync} from '../../../../src';

declare const iterable1: AsyncIterable<AsyncIterable<number>>;
declare const iterable2: AsyncIterable<Iterable<number>>;
declare const iterable3: AsyncIterable<AsyncIterable<number> | Iterable<string>>;

const test1 = pipeAsync(
    iterable1,
    flatMap(() => 123)
);
expectType<AsyncIterableExt<number>>(test1);

const test2 = pipeAsync(
    iterable2,
    flatMap(() => 123)
);
expectType<AsyncIterableExt<number>>(test2);

const test3 = pipeAsync(
    iterable3,
    flatMap((value, index) => {
        return index ? 123 : 'bla';
    })
);

// TODO: Why is this failing?
// expectType<AsyncIterableExt<number | string>>(test3);
