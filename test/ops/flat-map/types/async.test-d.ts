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
        expectType<AsyncIterable<number>>(value);
        return 123;
    })
);
expectType<AsyncIterableExt<number>>(test1);

const test2 = pipeAsync(
    iterable1,
    flatMap((value) => {
        expectType<AsyncIterable<number>>(value);
        return [1, 2, 3];
    })
);
expectType<AsyncIterableExt<number>>(test2);

const test3 = pipeAsync(
    iterable2,
    flatMap((value) => {
        expectType<Iterable<number>>(value);
        return 123;
    })
);
expectType<AsyncIterableExt<number>>(test3);

const test4 = pipeAsync(
    iterable2,
    flatMap((value) => {
        expectType<Iterable<number>>(value);
        return [1, 2, 3];
    })
);
expectType<AsyncIterableExt<number>>(test4);

const test5 = pipeAsync(
    iterable3,
    flatMap((value, index) => {
        expectType<AsyncIterable<number> | Iterable<string> | boolean>(value);
        return index ? 123 : 'bla';
    })
);
expectAssignable<AsyncIterableExt<number | string>>(test5);

const test6 = pipeAsync(
    iterable3,
    flatMap((value) => {
        expectType<AsyncIterable<number> | Iterable<string> | boolean>(value);
        return [123, 'bla'];
    })
);
expectType<AsyncIterableExt<number | string>>(test6);

const test7 = pipeAsync(
    iterable3,
    flatMap(async (value) => {
        expectType<AsyncIterable<number> | Iterable<string> | boolean>(value);
        return [123, 'bla'];
    })
);
expectType<AsyncIterableExt<number | string>>(test7);
