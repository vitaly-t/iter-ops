import type {IterationState, DuelOperation} from '../../types';
import {createDuelOperation, throwOnSync} from '../../utils';

import {retry as retryAsync} from './async';

/**
 * When an asynchronous iterable rejects, it retries getting the value specified number of times.
 *
 * Note that retries deplete values prior the operator that threw the error,  and so it is often
 * used in combination with operator {@link repeat}.
 *
 * ```ts
 * import {pipe, toAsync, tap, retry} from 'iter-ops';
 *
 * const i = pipe(
 *     toAsync([1, 2, 3, 4, 5, 6, 7, 8, 9]),
 *     tap(value => {
 *         if (value % 2 === 0) {
 *             throw new Error(`fail-${value}`); // throw for all even numbers
 *         }
 *     }),
 *     retry(1) // retry 1 time
 * );
 *
 * for await(const a of i) {
 *     console.log(a); // 1, 3, 5, 7, 9
 * }
 * ```
 *
 * Above, we end up with just odd numbers, because we do not provide any {@link repeat} logic,
 * and as a result, the `retry` simply jumps to the next value on each error.
 *
 * @throws `Error: 'Operator "retry" requires asynchronous pipeline'` when used inside a synchronous pipeline.
 *
 * @see
 *  - {@link repeat}
 * @category Async-only
 */
export function retry<T>(attempts: number): DuelOperation<T, T>;

/**
 * When an asynchronous iterable rejects, the callback is to return the flag, indicating whether
 * we should retry getting the value one more time.
 *
 * The callback is only invoked when there is a failure, and it receives:
 * - `index` - index of the iterable value that we failed to acquire
 * - `attempts` - number of retry attempts made so far (starts with 0)
 * - `state` - state for the entire iteration session
 *
 * Note that retries deplete values prior the operator that threw the error,
 * and so it is often used in combination with operator {@link repeat}.
 *
 * @throws `Error: 'Operator "retry" requires asynchronous pipeline'` when used inside a synchronous pipeline.
 *
 * @see
 *  - {@link repeat}
 * @category Async-only
 */
export function retry<T>(
    cb: (
        index: number,
        attempts: number,
        state: IterationState
    ) => boolean | Promise<boolean>
): DuelOperation<T, T>;

export function retry<T>(...args: unknown[]): DuelOperation<T, T> {
    return createDuelOperation<T, T>(throwOnSync('retry'), retryAsync, args);
}
