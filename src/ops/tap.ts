import {
    $A,
    $S,
    AsyncOperation,
    DuelOperation,
    IterationState,
    SyncOperation,
} from '../types';
import {createDuelOperation} from '../utils';

/**
 * Taps into each value, without changing the output, for logging or debugging.
 *
 * ```ts
 * import {pipe, tap} from 'iter-ops';
 *
 * const i = pipe(
 *     'text',
 *     tap(a => {
 *         console.log(a); //=> t e x t
 *     })
 * ); //=> IterableExt<string>
 *
 * const result = [...i]; // t e x t
 * ```
 *
 * @category Sync+Async
 */
export function tap<T>(
    cb: (value: T, index: number, state: IterationState) => void
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(tapSync, tapAsync, [cb]);
}

/**
 * Taps into each value, without changing the output, for logging or debugging.
 *
 * ```ts
 * import {pipe, tap} from 'iter-ops';
 *
 * const i = pipe(
 *     'text',
 *     tap(a => {
 *         console.log(a); //=> t e x t
 *     })
 * ); //=> IterableExt<string>
 *
 * const result = [...i]; // t e x t
 * ```
 * @category Operations
 */
export function tapSync<T>(
    cb: (value: T, index: number, state: IterationState) => void
): SyncOperation<T, T> {
    return (iterable) => ({
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    const a = i.next();
                    if (!a.done) {
                        cb(a.value, index++, state);
                    }
                    return a;
                },
            };
        },
    });
}

/**
 * Taps into each value, without changing the output, for logging or debugging.
 *
 * ```ts
 * import {pipe, tap} from 'iter-ops';
 *
 * const i = pipe(
 *     'text',
 *     tap(a => {
 *         console.log(a); //=> t e x t
 *     })
 * ); //=> IterableExt<string>
 *
 * const result = [...i]; // t e x t
 * ```
 * @category Operations
 */
export function tapAsync<T>(
    cb: (value: T, index: number, state: IterationState) => void
): AsyncOperation<T, T> {
    return (iterable) => ({
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (!a.done) {
                            cb(a.value, index++, state);
                        }
                        return a;
                    });
                },
            };
        },
    });
}
