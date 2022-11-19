import {
    $A,
    $S,
    Value,
    SyncValue,
    Operation,
    UnknownIterableOrIterator,
} from '../types';
import {createOperation} from '../utils';
import {isPromiseLike} from '../typeguards';

/**
 * Merges current iterable with any combination of values, iterators or iterables.
 * Merged inputs are iterated over after depleting the current iterable, in the order in which they were specified,
 * i.e. the standard {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat Array.concat} logic.
 *
 * ```ts
 * import {pipe, concat} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2],
 *     concat(3, 4, [5, 6])
 * );
 *
 * console.log(...i); //=> 1 2 3 4 5 6
 * ```
 *
 * Note that if you concatenate asynchronous iterables inside a synchronous pipeline, they will be processed as simple values.
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat Array.concat}
 * @category Sync+Async
 */
export function concat<T, Vs extends readonly unknown[]>(
    ...values: Vs
): Operation<
    T,
    T | (Vs[number] extends UnknownIterableOrIterator<infer U> ? U : never)
>;

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
            let v: any = iterable[$A](); // current value or iterator
            let index = -1, // current "values" index
                start = false; // set when need to step forward
            return {
                next() {
                    if (start) {
                        if (++index === values.length) {
                            return Promise.resolve({
                                value: undefined,
                                done: true,
                            });
                        }
                        v = values[index];
                        const k =
                            typeof v?.next === 'function'
                                ? v
                                : v?.[Symbol.iterator]?.() ||
                                  v?.[Symbol.asyncIterator]?.();
                        start = !k;
                        if (start) {
                            return Promise.resolve({value: v, done: false});
                        }
                        v = k;
                    }
                    const a = v.next();
                    const out = (b: any) => {
                        if (b.done) {
                            start = true;
                            return this.next();
                        }
                        return b;
                    };
                    return isPromiseLike(a)
                        ? a.then(out)
                        : Promise.resolve(out(a));
                },
            };
        },
    };
}
