import {pipeAsync} from '../../../src';
import type {AsyncOperation} from '../../../src/types';

declare const iterableString: Iterable<string>;
declare const iterableIterableNumber: Iterable<Iterable<number>>;

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

// $ExpectType AsyncIterableExt<string>
pipeAsync(iterableString, opString2String());

// $ExpectType AsyncIterableExt<number>
pipeAsync(iterableString, opString2String(), opString2Number());

// $ExpectType AsyncIterableExt<string>
pipeAsync(iterableString, opString2String(), opString2String());

// $ExpectType AsyncIterableExt<string>
pipeAsync(
    iterableString,
    opString2String(),
    opString2Number(),
    opNumber2String()
);

// $ExpectType AsyncIterableExt<number>
pipeAsync(
    iterableString,
    opString2String(),
    opString2Number(),
    opNumber2Number()
);

// $ExpectType AsyncIterableExt<unknown>
pipeAsync(iterableString, opString2R());

// $ExpectType AsyncIterableExt<"foo">
pipeAsync(iterableString, opString2R<'foo'>());

// $ExpectType AsyncIterableExt<string>
pipeAsync(iterableString, opString2R(), opT2Number(), opNumber2String());

// $ExpectType AsyncIterableExt<string>
pipeAsync(iterableString, opT2R(), opNumber2String());

// $ExpectType AsyncIterableExt<boolean>
pipeAsync(
    iterableString,
    opT2BooleanCallbackT2Boolean(() => true)
);

// $ExpectType AsyncIterableExt<unknown>
pipeAsync(
    iterableString,
    opString2RCallbackNone2Boolean(() => false)
);

// $ExpectType AsyncIterableExt<number>
pipeAsync(
    iterableString,
    opString2RCallbackNone2Boolean(() => false),
    opString2Number()
);

// $ExpectType AsyncIterableExt<number>
pipeAsync(
    iterableString,
    opT2RCallbackT2R(() => 1)
);

// $ExpectType AsyncIterableExt<string>
pipeAsync(iterableIterableNumber, opUnwrapT(), opNumber2String());
