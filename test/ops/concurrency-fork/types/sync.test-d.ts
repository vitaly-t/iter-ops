import {expectType} from 'tsd';

import {IterableExt, pipe, concurrencyFork} from '../../../../src';

declare const iterableNumber: Iterable<number>;

// with empty object:
const test1 = pipe(iterableNumber, concurrencyFork({}));
expectType<IterableExt<number>>(test1);

// returning nothing:
const test2 = pipe(
    iterableNumber,
    concurrencyFork({
        onSync() {}
    })
);
expectType<IterableExt<number>>(test2);

// returning null:
const test3 = pipe(
    iterableNumber,
    concurrencyFork({
        onSync(i) {
            return null;
        }
    })
);
expectType<IterableExt<number>>(test3);

// return an iterable:
const test4 = pipe(
    iterableNumber,
    concurrencyFork({
        onSync(i) {
            return i;
        }
    })
);
expectType<IterableExt<number>>(test4);

// returning an iterable of different type:
const test5 = pipe(
    iterableNumber,
    concurrencyFork({
        onSync(i) {
            return (function* () {
                yield 'hello';
            })();
        }
    })
);
expectType<IterableExt<string>>(test5);
