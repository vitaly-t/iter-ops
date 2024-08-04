import {expectType} from 'tsd';

import {type AsyncIterableExt, flat, pipe} from '../../../../src';

declare const iterable1: AsyncIterable<AsyncIterable<number>>;
declare const iterable2: AsyncIterable<Iterable<number>>;

declare const iterable3: AsyncIterable<
    AsyncIterable<number> | Iterable<string>
>;

declare const iterableDeep: AsyncIterable<
    | string
    | Iterable<number>
    | Iterable<Iterable<boolean>>
    | Iterable<Iterable<Iterable<Date>>>
    | Iterable<Iterable<Iterable<Iterable<RegExp>>>>
>;

const test1 = pipe(iterable1, flat());
expectType<AsyncIterableExt<number>>(test1);

const test2 = pipe(iterable1, flat(1));
expectType<AsyncIterableExt<number>>(test2);

const test3 = pipe(iterable1, flat(2));
expectType<AsyncIterableExt<number>>(test3);

const test4 = pipe(iterable2, flat());
expectType<AsyncIterableExt<number>>(test4);

const test5 = pipe(iterable2, flat(1));
expectType<AsyncIterableExt<number>>(test5);

const test6 = pipe(iterable2, flat(2));
expectType<AsyncIterableExt<number>>(test6);

const test7 = pipe(iterable3, flat());
expectType<AsyncIterableExt<number | string>>(test7);

const test8 = pipe(iterableDeep, flat());
expectType<
    AsyncIterableExt<
        | string
        | number
        | Iterable<boolean>
        | Iterable<Iterable<Date>>
        | Iterable<Iterable<Iterable<RegExp>>>
    >
>(test8);

const test9 = pipe(iterableDeep, flat(1));
expectType<
    AsyncIterableExt<
        | string
        | number
        | Iterable<boolean>
        | Iterable<Iterable<Date>>
        | Iterable<Iterable<Iterable<RegExp>>>
    >
>(test9);

const test10 = pipe(iterableDeep, flat(2));
expectType<
    AsyncIterableExt<
        string | number | boolean | Iterable<Date> | Iterable<Iterable<RegExp>>
    >
>(test10);

const test11 = pipe(iterableDeep, flat(3));
expectType<
    AsyncIterableExt<string | number | boolean | Date | Iterable<RegExp>>
>(test11);

const test12 = pipe(iterableDeep, flat(4));
expectType<AsyncIterableExt<string | number | boolean | Date | RegExp>>(test12);

const test13 = pipe(iterableDeep, flat(0));
expectType<
    AsyncIterableExt<
        | string
        | Iterable<number>
        | Iterable<Iterable<boolean>>
        | Iterable<Iterable<Iterable<Date>>>
        | Iterable<Iterable<Iterable<Iterable<RegExp>>>>
    >
>(test13);

const test14 = pipe(iterableDeep, flat(-1));
expectType<
    AsyncIterableExt<
        | string
        | Iterable<number>
        | Iterable<Iterable<boolean>>
        | Iterable<Iterable<Iterable<Date>>>
        | Iterable<Iterable<Iterable<Iterable<RegExp>>>>
    >
>(test14);
