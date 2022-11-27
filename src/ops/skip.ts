import {$A, $S, AsyncOperation, DuelOperation, SyncOperation} from '../types';
import {createDuelOperation} from '../utils';

/**
 * Starts emitting values after `count` number of values.
 *
 * ```ts
 * import {pipe, skip} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     skip(2)
 * );
 *
 * console.log(...i); //=> 3, 4, 5
 * ```
 *
 * @see
 *  - {@link skipUntil}
 *  - {@link skipWhile}
 *
 * @category Sync+Async
 */
export function skip<T>(count: number): DuelOperation<T, T> {
    return createDuelOperation<T, T>(skipSync, skipAsync, [count]);
}

/**
 * Starts emitting values after `count` number of values.
 *
 * ```ts
 * import {pipe, skip} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     skip(2)
 * );
 *
 * console.log(...i); //=> 3, 4, 5
 * ```
 *
 * @see
 *  - {@link skipUntil}
 *  - {@link skipWhile}
 * @category Operations
 */
export function skipSync<T>(count: number): SyncOperation<T, T> {
    return (iterable) => ({
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            let index = 0,
                finished = false;
            return {
                next(): IteratorResult<T> {
                    let a = i.next();
                    if (!finished) {
                        while (!a.done && index++ < count) {
                            a = i.next();
                        }
                        finished = true;
                    }
                    return a;
                },
            };
        },
    });
}

/**
 * Starts emitting values after `count` number of values.
 *
 * ```ts
 * import {pipe, skip} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     skip(2)
 * );
 *
 * console.log(...i); //=> 3, 4, 5
 * ```
 *
 * @see
 *  - {@link skipUntil}
 *  - {@link skipWhile}
 * @category Operations
 */

export function skipAsync<T>(count: number): AsyncOperation<T, T> {
    return (iterable) => ({
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            let index = 0,
                finished = false;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (!finished) {
                            finished = a.done || index++ >= count;
                        }
                        return finished ? a : this.next();
                    });
                },
            };
        },
    });
}
