import {expectAssignable, expectType} from 'tsd';

import {AsyncIterableExt, flatMap, pipeAsync} from '../../../../src';

declare const iterable1: AsyncIterable<AsyncIterable<number>>;
declare const iterable2: AsyncIterable<Iterable<number>>;
declare const iterable3: AsyncIterable<
    AsyncIterable<number> | Iterable<string> | boolean
>;

const test1 = pipeAsync(
    iterable1,
    flatMap((value) => {
        expectType<number>(value);
        return 123;
    })
);
expectType<AsyncIterableExt<number>>(test1);

const test2 = pipeAsync(
    iterable2,
    flatMap((value) => {
        expectType<number>(value);
        return 123;
    })
);
expectType<AsyncIterableExt<number>>(test2);

const test3 = pipeAsync(
    iterable3,
    flatMap((value, index) => {
        expectType<number | string | boolean>(value);
        return index ? 123 : 'bla';
    })
);
expectAssignable<AsyncIterableExt<number | string>>(test3);
