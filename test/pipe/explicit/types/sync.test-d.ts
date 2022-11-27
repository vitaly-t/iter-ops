import {expectType} from 'tsd';

import {pipe} from '../../../../src/pipe/sync';
import type {IterableExt, SyncOperation} from '../../../../src/types';

declare const iterableString: Iterable<string>;
declare const iterableIterableNumber: Iterable<Iterable<number>>;

declare function opString2String(): SyncOperation<string, string>;
declare function opString2Number(): SyncOperation<string, number>;
declare function opNumber2Number(): SyncOperation<number, number>;
declare function opNumber2String(): SyncOperation<number, string>;

declare function opString2R<R>(): SyncOperation<string, R>;
declare function opT2Number<T>(): SyncOperation<T, number>;
declare function opT2R<T, R>(): SyncOperation<T, R>;

declare function opString2RCallbackNone2Boolean<R>(
    foo: () => boolean
): SyncOperation<string, R>;

declare function opT2BooleanCallbackT2Boolean<T>(
    foo: (arg: T) => boolean
): SyncOperation<T, boolean>;

declare function opT2RCallbackT2R<T, R>(
    foo: (arg: T) => R
): SyncOperation<T, R>;

declare function opUnwrapT<T>(): SyncOperation<Iterable<T>, T>;

const test1 = pipe(iterableString, opString2String());
expectType<IterableExt<string>>(test1);

const test2 = pipe(iterableString, opString2String(), opString2Number());
expectType<IterableExt<number>>(test2);

const test3 = pipe(iterableString, opString2String(), opString2String());
expectType<IterableExt<string>>(test3);

const test4 = pipe(
    iterableString,
    opString2String(),
    opString2Number(),
    opNumber2String()
);
expectType<IterableExt<string>>(test4);

const test5 = pipe(
    iterableString,
    opString2String(),
    opString2Number(),
    opNumber2Number()
);
expectType<IterableExt<number>>(test5);

const test6 = pipe(iterableString, opString2R());
expectType<IterableExt<unknown>>(test6);

const test7 = pipe(iterableString, opString2R<'foo'>());
expectType<IterableExt<'foo'>>(test7);

const test8 = pipe(
    iterableString,
    opString2R(),
    opT2Number(),
    opNumber2String()
);
expectType<IterableExt<string>>(test8);

const test9 = pipe(iterableString, opT2R(), opNumber2String());
expectType<IterableExt<string>>(test9);

const test10 = pipe(
    iterableString,
    opT2BooleanCallbackT2Boolean(() => true)
);
expectType<IterableExt<boolean>>(test10);

const test11 = pipe(
    iterableString,
    opString2RCallbackNone2Boolean(() => false)
);
expectType<IterableExt<unknown>>(test11);

const test12 = pipe(
    iterableString,
    opString2RCallbackNone2Boolean(() => false),
    opString2Number()
);
expectType<IterableExt<number>>(test12);

const test13 = pipe(
    iterableString,
    opT2RCallbackT2R(() => 1)
);
expectType<IterableExt<number>>(test13);

const test14 = pipe(iterableIterableNumber, opUnwrapT(), opNumber2String());
expectType<IterableExt<string>>(test14);
