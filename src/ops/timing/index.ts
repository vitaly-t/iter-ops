import type {DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {timing as timingAsync} from './async';
import {timing as timingSync} from './sync';

import type {IValueTiming} from './types';
export * from './types';

/**
 * Measures timings for each value, and provides a notification callback.
 *
 * It is mainly to help evaluate performance of asynchronous lengthy iterables,
 * though it works synchronously also.
 *
 * The operator doesn't affect the iteration, unless the callback function throws an error.
 *
 * ```ts
 * import {pipe, map, wait, timing, catchError} from 'iter-ops';
 *
 * const i = pipe(
 *     asyncIterable,
 *     map(a => myService.requestData(a)), // map into promises
 *     wait(), // resolve each promise
 *     timing(t => {
 *         if(t.duration > 3000) {
 *             // took over 3s to get the value, needs investigation;
 *             throw new Error(`Took too long to get value ${t.value} for index ${t.index}`);
 *         }
 *     }),
 *     catchError((err, ctx) => {
 *         console.log(err?.message || err);
 *         throw err;
 *     })
 * );
 * ```
 *
 * @see
 *  - {@link IValueTiming}
 *  - {@link onEnd}
 * @category Diagnostics
 */
export function timing<T>(
    cb: (t: IValueTiming<T>) => void
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(timingSync, timingAsync, [cb]);
}

export {IValueTiming};
