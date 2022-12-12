import {$A, AsyncOperation, $S, SyncOperation, DuelOperation} from '../types';
import {createDuelOperation} from '../utils';

/**
 * Accumulates all values and emits an array.
 *
 * ```ts
 * import {pipe, toArray} from 'iter-ops';
 *
 * const i = pipe([1, 2, 3], toArray());
 *
 * console.log(i.first); //=> [1, 2, 3]
 * ```
 *
 * @see
 *  - {@link aggregate}
 *  - {@link spread}
 *  - {@link flat}
 * @category Sync+Async
 */
export function toArray<T>(): DuelOperation<T, T[]> {
    return createDuelOperation<T, T[]>(toArraySync, toArrayAsync);
}

/**
 * Accumulates all values and emits an array.
 *
 * ```ts
 * import {pipe, toArray} from 'iter-ops';
 *
 * const i = pipe([1, 2, 3], toArray());
 *
 * console.log(i.first); //=> [1, 2, 3]
 * ```
 *
 * @see
 *  - {@link aggregate}
 *  - {@link spread}
 *  - {@link flat}
 *
 * @category Operations
 */
export function toArraySync<T>(): SyncOperation<T, T[]> {
    return (iterable) => ({
        [$S](): Iterator<T[]> {
            const i = iterable[$S]();
            let done = false;
            return {
                next(): IteratorResult<T[]> {
                    if (done) {
                        return {value: undefined, done};
                    }
                    const arr = [];
                    let a;
                    while (!(a = i.next()).done) {
                        arr.push(a.value);
                    }
                    done = true;
                    return {value: arr, done: false};
                },
            };
        },
    });
}

/**
 * Accumulates all values and emits an array.
 *
 * ```ts
 * import {pipe, toArray} from 'iter-ops';
 *
 * const i = pipe([1, 2, 3], toArray());
 *
 * console.log(i.first); //=> [1, 2, 3]
 * ```
 *
 * @see
 *  - {@link aggregate}
 *  - {@link spread}
 *  - {@link flat}
 *
 * @category Operations
 */
export function toArrayAsync<T>(): AsyncOperation<T, T[]> {
    return (iterable) => ({
        [$A](): AsyncIterator<T[]> {
            const i = iterable[$A]();
            const value: T[] = [];
            let finished = false;
            return {
                next(): Promise<IteratorResult<T[]>> {
                    return i.next().then((a) => {
                        if (a.done) {
                            if (finished) {
                                return a;
                            }
                            finished = true;
                            return {value, done: false};
                        }
                        value.push(a.value);
                        return this.next();
                    });
                },
            };
        },
    });
}
