import {$A, $S, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Iteration summary, produced by [[onEnd]] operator.
 */
export interface IIterationSummary<T> {
    /**
     * Number of items iterated.
     */
    count: number;

    /**
     * Time in ms it took to finish the iteration.
     *
     * It is to help measure iteration performance.
     */
    duration: number;

    /**
     * Average duration, for processing one value:
     *  - = `duration` / `count`, if `count` > 0
     *  - = 0, if `count` = 0
     */
    avgDuration: number;

    /**
     * Last emitted value, if there was any (`undefined` otherwise).
     */
    lastValue: T | undefined;

    /**
     * Iteration concurrency flag:
     *  - `true` - synchronous iteration
     *  - `false` - asynchronous iteration
     */
    sync: boolean;
}

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
 *         if(s.avgDuration > 1000) {
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
 * @see [[IIterationSummary]], [[timing]]
 * @category Sync+Async
 */
export function onEnd<T>(
    cb: (s: IIterationSummary<T>) => void
): Operation<T, T>;

export function onEnd(...args: unknown[]) {
    return createOperation(onEndSync, onEndAsync, args);
}

function onEndSync<T>(
    iterable: Iterable<T>,
    cb: (s: IIterationSummary<T>) => void
): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            let start: number,
                finished: boolean,
                lastValue: T,
                count = 0;
            return {
                next(): IteratorResult<T> {
                    start = start || Date.now();
                    const a = i.next();
                    if (a.done) {
                        if (!finished) {
                            finished = true;
                            const duration = Date.now() - start;
                            const avgDuration =
                                count > 0 ? duration / count : 0;
                            cb({
                                count,
                                duration,
                                avgDuration,
                                lastValue,
                                sync: true,
                            });
                        }
                    } else {
                        lastValue = a.value;
                        count++;
                    }
                    return a;
                },
            };
        },
    };
}

function onEndAsync<T>(
    iterable: AsyncIterable<T>,
    cb: (s: IIterationSummary<T>) => void
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            let start: number,
                finished: boolean,
                lastValue: T,
                count = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    start = start || Date.now();
                    return i.next().then((a) => {
                        if (a.done) {
                            if (!finished) {
                                finished = true;
                                const duration = Date.now() - start;
                                const avgDuration =
                                    count > 0 ? duration / count : 0;
                                cb({
                                    count,
                                    duration,
                                    avgDuration,
                                    lastValue,
                                    sync: false,
                                });
                            }
                        } else {
                            lastValue = a.value;
                            count++;
                        }
                        return a;
                    });
                },
            };
        },
    };
}
