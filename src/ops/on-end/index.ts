import type {DuelOperation} from '../../types';
import {createDuelOperation} from '../../utils';

import {onEnd as onEndAsync} from './async';
import {onEnd as onEndSync} from './sync';

import type {IIterationSummary, IDuration, IValueDuration} from './types';
export * from './types';

/**
 * Notifies of the end of a successful iteration, for the immediately preceding operator, and provides a summary.
 *
 * It doesn't handle or affect any upstream errors, and should they occur, it may never reach the end,
 * and thus never trigger the notification.
 *
 * The operator doesn't affect the iteration, unless the callback function throws an error.
 *
 * ```ts
 * import {pipe, map, wait, onEnd, catchError} from 'iter-ops';
 *
 * const i = pipe(
 *     asyncIterable,
 *     map(a => myService.getValues(a)), // remap into requests-promises
 *     wait(), // resolve requests
 *     onEnd(s => {
 *         if(s.duration.average > 1000) {
 *             // took longer than 1s per value on average;
 *             throw new Error('Method getValues is too slow');
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
 *  - {@link IIterationSummary}
 *  - {@link timing}
 * @category Diagnostics
 */
export function onEnd<T>(
    cb: (s: IIterationSummary<T>) => void
): DuelOperation<T, T> {
    return createDuelOperation<T, T>(onEndSync, onEndAsync, [cb]);
}

export {IIterationSummary, IDuration, IValueDuration};
