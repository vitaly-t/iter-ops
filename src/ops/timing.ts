import {$A, $S, IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Value timing details, produced by the {@link timing} operator.
 *
 * @see {@link timing}
 */
export interface IValueTiming<T> {
    /**
     * Time in ms it took to get the value.
     */
    duration: number;

    /**
     * Index of the value that was timed.
     */
    index: number;

    /**
     * Value that was timed.
     */
    value: T;

    /**
     * Iteration session state.
     */
    state: IterationState;

    /**
     * Iteration concurrency flag:
     *  - `true` - synchronous iteration
     *  - `false` - asynchronous iteration
     */
    sync: boolean;
}

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
export function timing<T>(cb: (t: IValueTiming<T>) => void): Operation<T, T>;

export function timing(...args: unknown[]) {
    return createOperation(timingSync, timingAsync, args);
}

function timingSync<T>(
    iterable: Iterable<T>,
    cb: (t: IValueTiming<T>) => void
): Iterable<T> {
    return {
        [$S](): Iterator<T> {
            const i = iterable[$S]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    const start = Date.now();
                    const a = i.next();
                    if (!a.done) {
                        const duration = Date.now() - start;
                        cb({
                            duration,
                            index: index++,
                            value: a.value,
                            state,
                            sync: true
                        });
                    }
                    return a;
                }
            };
        }
    };
}

function timingAsync<T>(
    iterable: AsyncIterable<T>,
    cb: (t: IValueTiming<T>) => void
): AsyncIterable<T> {
    return {
        [$A](): AsyncIterator<T> {
            const i = iterable[$A]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    const start = Date.now();
                    return i.next().then((a) => {
                        if (!a.done) {
                            const duration = Date.now() - start;
                            cb({
                                duration,
                                index: index++,
                                value: a.value,
                                state,
                                sync: false
                            });
                        }
                        return a;
                    });
                }
            };
        }
    };
}
