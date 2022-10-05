import {pipeSync} from '../../../src';
import type {SyncOperation} from '../../../src/types';

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

// $ExpectType IterableExt<string>
pipeSync(iterableString, opString2String());

// $ExpectType IterableExt<number>
pipeSync(iterableString, opString2String(), opString2Number());

// $ExpectType IterableExt<string>
pipeSync(iterableString, opString2String(), opString2String());

// $ExpectType IterableExt<string>
pipeSync(
    iterableString,
    opString2String(),
    opString2Number(),
    opNumber2String()
);

// $ExpectType IterableExt<number>
pipeSync(
    iterableString,
    opString2String(),
    opString2Number(),
    opNumber2Number()
);

// $ExpectType IterableExt<unknown>
pipeSync(iterableString, opString2R());

// $ExpectType IterableExt<"foo">
pipeSync(iterableString, opString2R<'foo'>());

// $ExpectType IterableExt<string>
pipeSync(iterableString, opString2R(), opT2Number(), opNumber2String());

// $ExpectType IterableExt<string>
pipeSync(iterableString, opT2R(), opNumber2String());

// $ExpectType IterableExt<boolean>
pipeSync(
    iterableString,
    opT2BooleanCallbackT2Boolean(() => true)
);

// $ExpectType IterableExt<unknown>
pipeSync(
    iterableString,
    opString2RCallbackNone2Boolean(() => false)
);

// $ExpectType IterableExt<number>
pipeSync(
    iterableString,
    opString2RCallbackNone2Boolean(() => false),
    opString2Number()
);

// $ExpectType IterableExt<number>
pipeSync(
    iterableString,
    opT2RCallbackT2R(() => 1)
);

// $ExpectType IterableExt<string>
pipeSync(iterableIterableNumber, opUnwrapT(), opNumber2String());
