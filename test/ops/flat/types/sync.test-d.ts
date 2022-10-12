import {expectType} from 'tsd';

import {flat, IterableExt, pipe} from '../../../../src';

declare const iterableNumber: Iterable<Iterable<number>>;
declare const iterableDeep: Iterable<
    | string
    | Iterable<number>
    | Iterable<Iterable<boolean>>
    | Iterable<Iterable<Iterable<Date>>>
    | Iterable<Iterable<Iterable<Iterable<RegExp>>>>
>;

const test1 = pipe(iterableNumber, flat());
expectType<IterableExt<number>>(test1);

const test2 = pipe(iterableNumber, flat(1));
expectType<IterableExt<number>>(test2);

const test3 = pipe(iterableNumber, flat(2));
expectType<IterableExt<number>>(test3);

const test4 = pipe(iterableNumber, flat(3));
expectType<IterableExt<number>>(test4);

const test5 = pipe(iterableDeep, flat());
expectType<
    IterableExt<
        | string
        | number
        | Iterable<boolean>
        | Iterable<Iterable<Date>>
        | Iterable<Iterable<Iterable<RegExp>>>
    >
>(test5);

const test6 = pipe(iterableDeep, flat(1));
expectType<
    IterableExt<
        | string
        | number
        | Iterable<boolean>
        | Iterable<Iterable<Date>>
        | Iterable<Iterable<Iterable<RegExp>>>
    >
>(test6);

const test7 = pipe(iterableDeep, flat(2));
expectType<
    IterableExt<
        string | number | boolean | Iterable<Date> | Iterable<Iterable<RegExp>>
    >
>(test7);

const test8 = pipe(iterableDeep, flat(3));
expectType<IterableExt<string | number | boolean | Date | Iterable<RegExp>>>(
    test8
);

const test9 = pipe(iterableDeep, flat(4));
expectType<IterableExt<string | number | boolean | Date | RegExp>>(test9);

const test10 = pipe(iterableDeep, flat(0));
expectType<
    IterableExt<
        | string
        | Iterable<number>
        | Iterable<Iterable<boolean>>
        | Iterable<Iterable<Iterable<Date>>>
        | Iterable<Iterable<Iterable<Iterable<RegExp>>>>
    >
>(test10);

const test11 = pipe(iterableDeep, flat(-1));
expectType<
    IterableExt<
        | string
        | Iterable<number>
        | Iterable<Iterable<boolean>>
        | Iterable<Iterable<Iterable<Date>>>
        | Iterable<Iterable<Iterable<Iterable<RegExp>>>>
    >
>(test11);

const test12 = pipe(iterableDeep, flat(100));
expectType<IterableExt<unknown>>(test12);
