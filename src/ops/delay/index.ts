import type {DuelOperation, IterationState} from '../../types';
import {createDuelOperation, throwOnSync} from '../../utils';

import {delay as delayAsync} from './async';

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
