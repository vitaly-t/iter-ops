import {$A, $S, Value, SyncValue, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Merges current iterable with a list of values, iterators or iterables.
 * Merged inputs are iterated over after depleting the current iterable, in the order in which they were specified,
 * i.e. the standard `Array.concat` logic.
 *
 * Note that if you concatenate asynchronous iterables with a synchronous pipeline, they will be processed as simple values.
 *
 * @see
 *  - [Array.concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)
 * @category Sync+Async
 */
export function concat<T, Vs extends readonly unknown[]>(
    ...values: Vs
): Operation<T, T | Vs[number]>;

export function concat(...args: unknown[]) {
    return createOperation(concatSync, concatAsync, args);
}

function concatSync<T>(
    iterable: Iterable<T>,
    ...values: SyncValue<T>[]
): Iterable<any> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            let index = -1,
                k: Iterator<T>,
                v: any,
                start = true;
            return {
                next(): IteratorResult<T> {
                    if (index < 0) {
                        const a = i.next();
                        if (!a.done) {
                            return a;
                        }
                        index = 0;
                    }
                    while (index < values.length) {
                        if (start) {
                            v = values[index];
                            k = typeof v?.next === 'function' ? v : v?.[$S]?.();
                            start = false;
                        }
                        if (k) {
                            const b = k.next();
                            if (!b.done) {
                                return b;
                            }
                        }
                        start = true;
                        index++;
                        if (!k) {
                            return {value: v, done: false};
                        }
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    };
}

function concatAsync<T>(
    iterable: AsyncIterable<T>,
    ...values: Value<T>[]
): AsyncIterable<any> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            let index = -1,
                k: AsyncIterator<T>,
                v: any,
                start = true;
            return {
                async next(): Promise<IteratorResult<T>> {
                    if (index < 0) {
                        const a = await i.next();
                        if (!a.done) {
                            return a;
                        }
                        index = 0;
                    }
                    while (index < values.length) {
                        if (start) {
                            v = values[index];
                            k =
                                typeof v?.next === 'function'
                                    ? v
                                    : v?.[$S]?.() || v?.[$A]?.();
                            start = false;
                        }
                        if (k) {
                            const b = await k.next();
                            if (!b.done) {
                                return b;
                            }
                        }
                        start = true;
                        index++;
                        if (!k) {
                            return {value: v, done: false};
                        }
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    };
}
