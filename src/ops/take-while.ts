import {
    $A,
    $S,
    AsyncOperation,
    DuelOperation,
    IterationState,
    SyncOperation,
} from '../types';
import {isPromiseLike} from '../typeguards';
import {createDuelOperation} from '../utils';

/**
 * Takes values while the predicate test succeeds.
 *
 * ```ts
 * import {pipe, takeWhile} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     takeWhile(a => a < 5) // take while value < 5
 * );
 *
 * console.log(...i); //=> 1, 2, 3, 4
 * ```
 *
 * Note that the predicate can only return a `Promise` inside an asynchronous pipeline,
 * or else the `Promise` will be treated as a truthy value.
 *
 * @see
 *  - {@link skip}
 *  - {@link skipUntil}
 *  - {@link skipWhile}
 *  - {@link take}
 *  - {@link takeLast}
 *  - {@link takeUntil}
 *
 * @category Sync+Async
 */
export function takeWhile<T>(
    cb: (
        value: T,
        index: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(takeWhileSync, takeWhileAsync, [cb]);
}

/**
 * Takes values while the predicate test succeeds.
 *
 * ```ts
 * import {pipe, takeWhile} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     takeWhile(a => a < 5) // take while value < 5
 * );
 *
 * console.log(...i); //=> 1, 2, 3, 4
 * ```
 *
 * @see
 *  - {@link skip}
 *  - {@link skipUntil}
 *  - {@link skipWhile}
 *  - {@link take}
 *  - {@link takeLast}
 *  - {@link takeUntil}
 * @category Operations
 */
export function takeWhileSync<T>(
    cb: (value: T, index: number, state: IterationState) => boolean
): SyncOperation<T, T> {
    return (iterable) => ({
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0,
                stopped: boolean;
            return {
                next(): IteratorResult<T> {
                    if (!stopped) {
                        const a = i.next();
                        stopped = a.done || !cb(a.value, index++, state);
                        if (!stopped) {
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
 * Takes values while the predicate test succeeds.
 *
 * ```ts
 * import {pipe, takeWhile} from 'iter-ops';
 *
 * const i = pipe(
 *     [1, 2, 3, 4, 5, 6, 7, 8, 9],
 *     takeWhile(a => a < 5) // take while value < 5
 * );
 *
 * console.log(...i); //=> 1, 2, 3, 4
 * ```
 *
 * @see
 *  - {@link skip}
 *  - {@link skipUntil}
 *  - {@link skipWhile}
 *  - {@link take}
 *  - {@link takeLast}
 *  - {@link takeUntil}
 * @category Operations
 */
export function takeWhileAsync<T>(
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
                stopped: boolean;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (stopped || a.done) {
                            return {value: undefined, done: true};
                        }
                        const r = cb(
                            a.value,
                            index++,
                            state
                        ) as Promise<boolean>;
                        const out = (flag: any): IteratorResult<T> => {
                            stopped = !flag;
                            return stopped ? {value: undefined, done: true} : a;
                        };
                        return isPromiseLike(r) ? r.then(out) : out(r);
                    });
                },
            };
        },
    });
}
