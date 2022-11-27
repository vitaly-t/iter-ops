import {expectType} from 'tsd';

import {pipe} from '../../../../src/pipe/async';
import type {AsyncIterableExt, AsyncOperation} from '../../../../src/types';

declare const iterableString: AsyncIterable<string>;
declare const iterableIterableNumber: AsyncIterable<Iterable<number>>;

declare function opString2String(): AsyncOperation<string, string>;
declare function opString2Number(): AsyncOperation<string, number>;
declare function opNumber2Number(): AsyncOperation<number, number>;
declare function opNumber2String(): AsyncOperation<number, string>;

declare function opString2R<R>(): AsyncOperation<string, R>;
declare function opT2Number<T>(): AsyncOperation<T, number>;
declare function opT2R<T, R>(): AsyncOperation<T, R>;

declare function opString2RCallbackNone2Boolean<R>(
    foo: () => boolean
): AsyncOperation<string, R>;

declare function opT2BooleanCallbackT2Boolean<T>(
    foo: (arg: T) => boolean
): AsyncOperation<T, boolean>;

declare function opT2RCallbackT2R<T, R>(
    foo: (arg: T) => R
): AsyncOperation<T, R>;

declare function opUnwrapT<T>(): AsyncOperation<Iterable<T>, T>;

const test1 = pipe(iterableString, opString2String());
expectType<AsyncIterableExt<string>>(test1);

const test2 = pipe(iterableString, opString2String(), opString2Number());
expectType<AsyncIterableExt<number>>(test2);

const test3 = pipe(iterableString, opString2String(), opString2String());
expectType<AsyncIterableExt<string>>(test3);

const test4 = pipe(
    iterableString,
    opString2String(),
    opString2Number(),
    opNumber2String()
);
expectType<AsyncIterableExt<string>>(test4);

const test5 = pipe(
    iterableString,
    opString2String(),
    opString2Number(),
    opNumber2Number()
);
expectType<AsyncIterableExt<number>>(test5);

const test6 = pipe(iterableString, opString2R());
expectType<AsyncIterableExt<unknown>>(test6);

const test7 = pipe(iterableString, opString2R<'foo'>());
expectType<AsyncIterableExt<'foo'>>(test7);

const test8 = pipe(
    iterableString,
    opString2R(),
    opT2Number(),
    opNumber2String()
);
expectType<AsyncIterableExt<string>>(test8);

const test9 = pipe(iterableString, opT2R(), opNumber2String());
expectType<AsyncIterableExt<string>>(test9);

const test10 = pipe(
    iterableString,
    opT2BooleanCallbackT2Boolean(() => true)
);
expectType<AsyncIterableExt<boolean>>(test10);

const test11 = pipe(
    iterableString,
    opString2RCallbackNone2Boolean(() => false)
);
expectType<AsyncIterableExt<unknown>>(test11);

const test12 = pipe(
    iterableString,
    opString2RCallbackNone2Boolean(() => false),
    opString2Number()
);
expectType<AsyncIterableExt<number>>(test12);

const test13 = pipe(
    iterableString,
    opT2RCallbackT2R(() => 1)
);
expectType<AsyncIterableExt<number>>(test13);

const test14 = pipe(iterableIterableNumber, opUnwrapT(), opNumber2String());
expectType<AsyncIterableExt<string>>(test14);
