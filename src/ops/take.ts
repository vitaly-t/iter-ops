import {$A, $S, AsyncOperation, DuelOperation, SyncOperation} from '../types';
import {createDuelOperation} from '../utils';

/**
 * Emits up to `count` number of values, then stops iteration.
 *
 * ```ts
 * import {pipe, take} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     take(2)
 * );
 *
 * console.log(...i); //=> 1, 2
 * ```
 *
 * @see
 *  - {@link takeLast}
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 *
 * @category Sync+Async
 */
export function take<T>(count: number): DuelOperation<T, T> {
    return createDuelOperation<T, T>(takeSync, takeAsync, [count]);
}

/**
 * Emits up to `count` number of values, then stops iteration.
 *
 * ```ts
 * import {pipe, take} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     take(2)
 * );
 *
 * console.log(...i); //=> 1, 2
 * ```
 *
 * @see
 *  - {@link takeLast}
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 * @category Operations
 */
export function takeSync<T>(count: number): SyncOperation<T, T> {
    return (iterable) => ({
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            let index = 0,
                finished: boolean;
            return {
                next(): IteratorResult<T> {
                    if (!finished) {
                        const a = i.next();
                        finished = a.done || index++ >= count;
                        if (!finished) {
                            return a;
                        }
                    }
                    return {value: undefined, done: true};
                },
            };
        },
    });
}

/**
 * Emits up to `count` number of values, then stops iteration.
 *
 * ```ts
 * import {pipe, take} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5],
 *     take(2)
 * );
 *
 * console.log(...i); //=> 1, 2
 * ```
 *
 * @see
 *  - {@link takeLast}
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 * @category Operations
 */
export function takeAsync<T>(count: number): AsyncOperation<T, T> {
    return (iterable) => ({
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            let index = 0,
                finished: boolean;
            return {
                next(): Promise<IteratorResult<T>> {
                    if (finished) {
                        return Promise.resolve({value: undefined, done: true});
                    }
                    return i.next().then((a) => {
                        finished = a.done || index++ >= count;
                        return finished ? {value: undefined, done: true} : a;
                    });
                },
            };
        },
    });
}
