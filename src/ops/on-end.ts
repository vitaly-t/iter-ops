import {$A, $S, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Value-duration details, for minimum or maximum duration.
 */
export interface IValueDuration<T> {
    /**
     * Delay in ms it took to get the value.
     */
    delay: number;

    /**
     * Index of the value.
     */
    index: number;

    /**
     * The value retrieved.
     */
    value: T;
}

/**
 * All duration/performance details.
 */
export interface IDuration<T> {
    /**
     * Average duration, for processing one value:
     *  - = `total` / `count`, if `count` > 0
     *  - = 0, if `count` = 0
     */
    average: number;

    /**
     * Maximum iteration-delay details.
     *
     * It is `undefined` when the iteration is empty.
     */
    max?: IValueDuration<T>;

    /**
     * Minimum iteration-delay details.
     *
     * It is `undefined` when the iteration is empty.
     */
    min?: IValueDuration<T>;

    /**
     * Total duration, in ms, for the entire iteration.
     */
    total: number;
}

/**
 * Iteration summary, produced by {@link onEnd} operator.
 */
export interface IIterationSummary<T> {
    /**
     * Number of items iterated.
     */
    count: number;

    /**
     * Duration details, to help measure iteration performance.
     */
    duration: IDuration<T>;

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
 * ** Breaking changes in v2.0.0**
 *
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
                count = 0,
                max: IValueDuration<T>,
                min: IValueDuration<T>;
            return {
                next(): IteratorResult<T> {
                    const now = Date.now();
                    start = start || now;
                    const a = i.next();
                    if (a.done) {
                        if (!finished) {
                            finished = true;
                            const total = Date.now() - start;
                            const average = count > 0 ? total / count : 0;
                            cb({
                                count,
                                duration: {average, min, max, total},
                                lastValue,
                                sync: true,
                            });
                        }
                    } else {
                        lastValue = a.value;
                        const delay = Date.now() - now;
                        if (!count) {
                            max = {delay, index: 0, value: lastValue};
                            min = {delay, index: 0, value: lastValue};
                        }
                        // istanbul ignore next (test requires significant sync payload)
                        if (delay > max.delay) {
                            max.delay = delay;
                            max.index = count;
                            max.value = lastValue;
                        }
                        // istanbul ignore next (test requires significant sync payload)
                        if (delay < min.delay) {
                            min.delay = delay;
                            min.index = count;
                            min.value = lastValue;
                        }
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
    };
}
