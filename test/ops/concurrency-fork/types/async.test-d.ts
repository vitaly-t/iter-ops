import {expectType} from 'tsd';

import {AsyncIterableExt, pipe, concurrencyFork} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

// with empty object:
const test1 = pipe(iterableNumber, concurrencyFork({}));
expectType<AsyncIterableExt<number>>(test1);

// returning nothing:
const test2 = pipe(
    iterableNumber,
    concurrencyFork({
        onAsync() {},
    })
);
expectType<AsyncIterableExt<number>>(test2);

// returning null:
const test3 = pipe(
    iterableNumber,
    concurrencyFork({
        onAsync(i) {
            return null;
        },
    })
);
expectType<AsyncIterableExt<number>>(test3);

// return an iterable:
const test4 = pipe(
    iterableNumber,
    concurrencyFork({
        onAsync(i) {
            return i;
        },
    })
);
expectType<AsyncIterableExt<number>>(test4);

// returning an iterable of different type:
const test5 = pipe(
    iterableNumber,
    concurrencyFork({
        onAsync(i) {
            return (async function* () {
                yield 'hello';
            })();
        },
    })
);
expectType<AsyncIterableExt<string>>(test5);
