import {expectType} from 'tsd';

import {flat, IterableExt, pipe} from '../../../../src';

declare const iterableNumber: Iterable<Iterable<number>>;
declare const iteratorNumber: Iterable<Iterator<number>>;
declare const mixedDeep: Iterable<
    | string
    | Iterable<number>
    | Iterable<Iterator<boolean>>
    | Iterator<Iterable<Iterable<Date>>>
    | Iterable<Iterable<Iterator<Iterator<RegExp>>>>
>;

const iterableTest1 = pipe(iterableNumber, flat());
expectType<IterableExt<number>>(iterableTest1);

const iterableTest2 = pipe(iterableNumber, flat(1));
expectType<IterableExt<number>>(iterableTest2);

const iterableTest3 = pipe(iterableNumber, flat(2));
expectType<IterableExt<number>>(iterableTest3);

const iterableTest4 = pipe(iterableNumber, flat(3));
expectType<IterableExt<number>>(iterableTest4);

const iteratorTest1 = pipe(iteratorNumber, flat());
expectType<IterableExt<number>>(iteratorTest1);

const iteratorTest2 = pipe(iteratorNumber, flat(1));
expectType<IterableExt<number>>(iteratorTest2);

const iteratorTest3 = pipe(iteratorNumber, flat(2));
expectType<IterableExt<number>>(iteratorTest3);

const iteratorTest4 = pipe(iteratorNumber, flat(3));
expectType<IterableExt<number>>(iteratorTest4);

const mixedDeepTest1 = pipe(mixedDeep, flat());
expectType<
    IterableExt<
        | string
        | number
        | Iterator<boolean>
        | Iterable<Iterable<Date>>
        | Iterable<Iterator<Iterator<RegExp>>>
    >
>(mixedDeepTest1);

const mixedDeepTest2 = pipe(mixedDeep, flat(1));
expectType<
    IterableExt<
        | string
        | number
        | Iterator<boolean>
        | Iterable<Iterable<Date>>
        | Iterable<Iterator<Iterator<RegExp>>>
    >
>(mixedDeepTest2);

const mixedDeepTest3 = pipe(mixedDeep, flat(2));
expectType<
    IterableExt<
        string | number | boolean | Iterable<Date> | Iterator<Iterator<RegExp>>
    >
>(mixedDeepTest3);

const mixedDeepTest4 = pipe(mixedDeep, flat(3));
expectType<IterableExt<string | number | boolean | Date | Iterator<RegExp>>>(
    mixedDeepTest4
);

const mixedDeepTest5 = pipe(mixedDeep, flat(4));
expectType<IterableExt<string | number | boolean | Date | RegExp>>(
    mixedDeepTest5
);

const mixedDeepTest6 = pipe(mixedDeep, flat(0));
expectType<
    IterableExt<
        | string
        | Iterable<number>
        | Iterable<Iterator<boolean>>
        | Iterator<Iterable<Iterable<Date>>>
        | Iterable<Iterable<Iterator<Iterator<RegExp>>>>
    >
>(mixedDeepTest6);

const mixedDeepTest7 = pipe(mixedDeep, flat(-1));
expectType<
    IterableExt<
        | string
        | Iterable<number>
        | Iterable<Iterator<boolean>>
        | Iterator<Iterable<Iterable<Date>>>
        | Iterable<Iterable<Iterator<Iterator<RegExp>>>>
    >
>(mixedDeepTest7);

const mixedDeepTest8 = pipe(mixedDeep, flat(100));
expectType<IterableExt<unknown>>(mixedDeepTest8);
