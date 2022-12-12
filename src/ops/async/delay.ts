import {createDuelOperation, throwOnSync} from '../../utils';
import {$A, AsyncOperation, DuelOperation, IterationState} from '../../types';

/**
 * Delays each value by the specified timeout.
 * When the timeout is a negative number, no delay added.
 *
 * ```ts
 * import {pipe, toAsync, delay} from 'iter-ops';
 *
 * const data = [1, 2, 3, 4, 5]; // some synchronous data
 *
 * const i = pipe(
 *     toAsync(data), // make asynchronous
 *     delay(1000)
 * );
 *
 * for await(const a of i) {
 *     console.log(a); //=> 1, 2, 3, 4, 5 (with 1s delay)
 * }
 * ```
 *
 * @throws `Error: 'Operator "delay" requires asynchronous pipeline'` when used inside a synchronous pipeline.
 *
 * @see
 *  - {@link throttle}
 *  - {@link timeout}
 * @category Async-only
 */
export function delay<T>(timeout: number): DuelOperation<T, T>;

/**
 * Delays each value by the specified timeout (as returned from the callback).
 * When the timeout is a negative number, it is not added.
 *
 * Note that it doesn't support return of `Promise<number>` on purpose, to avoid
 * confusion with what operator {@link throttle} does.
 *
 * @throws `Error: 'Operator "delay" requires asynchronous pipeline'` when used inside a synchronous pipeline.
 *
 * @category Async-only
 */
export function delay<T>(
    cb: (value: T, index: number, state: IterationState) => number
): DuelOperation<T, T>;

export function delay<T>(...args: unknown[]): DuelOperation<T, T> {
    return createDuelOperation<T, T>(throwOnSync('delay'), delayAsync, args);
}

/**
 * Delays each value by the specified timeout.
 * When the timeout is a negative number, no delay added.
 *
 * ```ts
 * import {pipe, toAsync, delay} from 'iter-ops';
 *
 * const data = [1, 2, 3, 4, 5]; // some synchronous data
 *
 * const i = pipe(
 *     toAsync(data), // make asynchronous
 *     delay(1000)
 * );
 *
 * for await(const a of i) {
 *     console.log(a); //=> 1, 2, 3, 4, 5 (with 1s delay)
 * }
 * ```
 *
 * @see
 *  - {@link throttle}
 *  - {@link timeout}
 * @category Operations
 */
export function delayAsync<T>(timeout: number): AsyncOperation<T, T>;

/**
 * Delays each value by the specified timeout (as returned from the callback).
 * When the timeout is a negative number, it is not added.
 *
 * Note that it doesn't support return of `Promise<number>` on purpose, to avoid
 * confusion with what operator {@link throttle} does.
 */
export function delayAsync<T>(
    cb: (value: T, index: number, state: IterationState) => number
): AsyncOperation<T, T>;

export function delayAsync<T>(
    timeout:
        | number
        | ((value: T, index: number, state: IterationState) => number)
): AsyncOperation<T, T> {
    return (iterable) => ({
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            if (timeout < 0) {
                return i; // use no delay;
            }
            const cb = typeof timeout === 'function' && timeout;
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then((a) => {
                        if (a.done) {
                            return a;
                        }
                        const delay: number = cb
                            ? cb(a.value, index++, state)
                            : timeout;
                        return delay < 0
                            ? a
                            : new Promise((resolve) =>
                                  setTimeout(() => resolve(a), delay)
                              );
                    });
                },
            };
        },
    });
}
