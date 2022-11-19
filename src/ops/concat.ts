import {
    $A,
    $S,
    Value,
    SyncValue,
    Operation,
    UnknownIterableOrIterator,
} from '../types';
import {createOperation} from '../utils';
import {isPromiseLike} from "../typeguards";

/**
 * Merges current iterable with a list of values, iterators or iterables.
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
 * Note that if you concatenate asynchronous iterables with a synchronous pipeline, they will be processed as simple values.
 *
 * @see
 *  - {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat Array.concat}
 * @category Sync+Async
 */
export function concat<T, Vs extends readonly unknown[]>(
    ...values: Vs
): Operation<T,
    T | (Vs[number] extends UnknownIterableOrIterator<infer U> ? U : never)>;

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
            let i = iterable[$A]();
            let index = -1, // current "values" index
                start = true, // set when need to step forward
                iter = true; // set when "i" is iterable

            return {
                next() {
                    if (index < 0) {
                        return i.next().then(a => {
                            if (a.done) {
                                index = 0;
                                return this.next();
                            }
                            return a;
                        });
                    }
                    if (index < values.length) {
                        // we can continue iterating;
                        if (start) {
                            const v: any = values[index++]; // new value
                            if (typeof v?.next === 'function') {
                                iter = true; // it is iterable
                                start = false;
                                i = v;
                            } else {
                                if (v[Symbol.iterator]) {
                                    iter = true; // it is iterable
                                    start = false;
                                    i = v[Symbol.iterator]();
                                } else {
                                    if (v[Symbol.asyncIterator]) {
                                        iter = true; // it is iterable
                                        start = false;
                                        i = v[Symbol.asyncIterator]();
                                    } else {
                                        iter = false; // not iterable
                                        start = true;
                                        i = v;
                                    }
                                }
                            }
                        }
                        if (iter) {
                            const a = i.next() as any;
                            const out = (b: any) => {
                                if (b.done) {
                                    return this.next();
                                }
                                return b;
                            };
                            return isPromiseLike(a) ? a.then((b: any) => out(b)) : out(a);
                        }
                        return Promise.resolve({value: i, done: false});
                    }
                    return Promise.resolve({value: undefined, done: true});
                }
            };
        },
    };
}

async function* myToAsync<T>(data: Iterable<T>) {
    const i = data[Symbol.iterator]();
    let a;
    do {
        a = i.next();
        if (!a.done) {
            yield a.done;
        }
    } while (!a.done);
}

const r = concatAsync(myToAsync([1, 2]), 'one' as any, [undefined, 'word', false]);

(async function () {
    for await(const w of r) {
        console.log(w);
    }
})();
