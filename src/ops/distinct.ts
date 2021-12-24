import {$A, $S, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Emits unique values, with optional key selector.
 *
 * ```ts
 * import {pipe, distinct} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 1, 1, 2, 2, 2, 3, 3],
 *     distinct() // selector not needed for simple types
 * );
 *
 * console.log(...i); //=> 1, 2, 3
 * ```
 *
 * With optional selector function:
 *
 * ```ts
 * import {pipe, distinct} from 'iter-ops';
 *
 * const i = pipe(
 *     [{a: 1}, {a: 1}, {a: 2}, {a: 2}],
 *     distinct(v => v.a)
 * );
 *
 * console.log(...i); //=> {a: 1}, {a: 2}
 * ```
 *
 * @category Sync+Async
 */
export function distinct<T, K>(keySelector?: (value: T, index: number) => K): Operation<T, T> {
    return createOperation(distinctSync, distinctAsync, arguments);
}

function distinctSync<T, K>(iterable: Iterable<T>, keySelector?: (value: T, index: number) => K): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const ks = typeof keySelector === 'function' && keySelector;
            const keySet = new Set();
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    let a;
                    do {
                        a = i.next();
                        if (!a.done) {
                            const key = ks ? ks(a.value, index++) : a.value;
                            if (!keySet.has(key)) {
                                keySet.add(key);
                                return a;
                            }
                        }
                    } while (!a.done);
                    keySet.clear(); // for better memory management
                    return a;
                }
            };
        }
    };
}

function distinctAsync<T, K>(iterable: AsyncIterable<T>, keySelector?: (value: T, index: number) => K): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const ks = typeof keySelector === 'function' && keySelector;
            const keySet = new Set();
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => {
                        if (a.done) {
                            keySet.clear(); // for better memory management
                            return a;
                        }
                        const key = ks ? ks(a.value, index++) : a.value;
                        if (!keySet.has(key)) {
                            keySet.add(key);
                            return a;
                        }
                        return this.next();
                    });
                }
            };
        }
    };
}
