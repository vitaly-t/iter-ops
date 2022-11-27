import type {IterationState, DuelOperation} from '../../types';
import {createDuelOperation, throwOnSync} from '../../utils';

import {throttle as throttleAsync} from './async';

/**
 * Emits each value after the callback result resolves, to control/mitigate the processing flow.
 *
 * The resolved value itself is ignored.
 *
 * ```ts
 * import {pipe, toAsync, tap, throttle} from 'iter-ops';
 *
 * const i = pipe(
 *     toAsync([1, 2, 3, 4, 5]),
 *     throttle(async (value, index, state) => {
 *         await processValue(value);
 *     }),
 *     tap(value => {
 *         // value = 1, 2, 3, 4, 5 (each delayed by processing time)
 *     })
 * );
 * ```
 *
 * @throws `Error: 'Operator "throttle" requires asynchronous pipeline'` when used inside a synchronous pipeline.
 *
 * @see
 *  - {@link delay}
 * @category Async-only
 */
export function throttle<T>(
    cb: (value: T, index: number, state: IterationState) => Promise<any>
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(throwOnSync('throttle'), throttleAsync, [
        cb,
    ]);
}
