import {createDuelOperation} from '../utils';
import {
    $A,
    $S,
    AsyncOperation,
    DuelOperation,
    IterationState,
    SyncOperation,
} from '../types';
import {isPromiseLike} from '../typeguards';

/**
 * Skips values while the predicate test succeeds.
 *
 * ```ts
 * import {pipe, skipWhile} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     skipWhile(a => a < 5) // skip while value < 5
 * );
 *
 * console.log(...i); //=> 5, 6, 7, 8, 9
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link skip}
 *  - {@link skipUntil}
 *  - {@link take}
 *  - {@link takeLast}
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 *
 * @category Sync+Async
 */
export function skipWhile<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(skipWhileSync, skipWhileAsync, [cb]);
}

/**
 * Skips values while the predicate test succeeds.
 *
 * ```ts
 * import {pipe, skipWhile} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     skipWhile(a => a < 5) // skip while value < 5
 * );
 *
 * console.log(...i); //=> 5, 6, 7, 8, 9
 * ```
 *
 * @see
 *  - {@link skip}
 *  - {@link skipUntil}
 *  - {@link take}
 *  - {@link takeLast}
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 * @category Operations
 */
export function skipWhileSync<T>(
    cb: (value: T, index: number, state: IterationState) => boolean
): SyncOperation<T, T> {
    return (iterable) => ({
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0,
                started: boolean;
            return {
                next(): IteratorResult<T> {
                    let a = i.next();
                    if (!started) {
                        while (!a.done && cb(a.value, index++, state)) {
                            a = i.next();
                        }
                        started = true;
                    }
                    return a;
                },
            };
        },
    });
}

/**
 * Skips values while the predicate test succeeds.
 *
 * ```ts
 * import {pipe, skipWhile} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     skipWhile(a => a < 5) // skip while value < 5
 * );
 *
 * console.log(...i); //=> 5, 6, 7, 8, 9
 * ```
 *
 * @see
 *  - {@link skip}
 *  - {@link skipUntil}
 *  - {@link take}
 *  - {@link takeLast}
 *  - {@link takeUntil}
 *  - {@link takeWhile}
 * @category Operations
 */
export function skipWhileAsync<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): AsyncOperation<T, T> {
    return (iterable) => ({
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let index = 0,
                started: boolean;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (started || a.done) {
                            return a;
                        }
                        const r = cb(
                            a.value,
                            index++,
                            state
                        ) as Promise<boolean>;
                        const out = (flag: any) => {
                            started = !flag;
                            return started ? a : this.next();
                        };
                        return isPromiseLike(r) ? r.then(out) : out(r);
                    });
                },
            };
        },
    });
}
