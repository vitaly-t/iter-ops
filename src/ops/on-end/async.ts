import {$A, AsyncOperation} from '../../types';

import type {IIterationSummary, IValueDuration} from './types';
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
 *
 * @category Diagnostics
 */
export function onEnd<T>(
    cb: (s: IIterationSummary<T>) => void
): AsyncOperation<T, T> {
    return (iterable) => ({
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            let start: number,
                finished: boolean,
                lastValue: T,
                count = 0,
                max: IValueDuration<T>,
                min: IValueDuration<T>;
            return {
                next(): Promise<IteratorResult<T>> {
                    const now = Date.now();
                    start = start || now;
                    return i.next().then((a) => {
                        if (a.done) {
                            if (!finished) {
                                finished = true;
                                const total = Date.now() - start;
                                const average = count > 0 ? total / count : 0;
                                cb({
                                    count,
                                    duration: {average, min, max, total},
                                    lastValue,
                                    sync: false,
                                });
                            }
                        } else {
                            lastValue = a.value;
                            const delay = Date.now() - now;
                            if (!count) {
                                max = {delay, index: 0, value: lastValue};
                                min = {delay, index: 0, value: lastValue};
                            }
                            if (delay > max.delay) {
                                max.delay = delay;
                                max.index = count;
                                max.value = lastValue;
                            }
                            if (delay < min.delay) {
                                min.delay = delay;
                                min.index = count;
                                min.value = lastValue;
                            }
                            count++;
                        }
                        return a;
                    });
                },
            };
        },
    });
}
