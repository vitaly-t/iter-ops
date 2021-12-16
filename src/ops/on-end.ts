import {Operation} from '../types';
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
     * Last emitted value, if there was any (`undefined` otherwise).
     */
    lastValue: T | undefined;

    /**
     * Iteration concurrency flag:
     *  - `true` - iteration was synchronous
     *  - `false` - iteration was asynchronous
     */
    sync: boolean;
}

/**
 * Notifies of the end of iteration, for the immediately preceding operator, and provides a summary.
 *
 * ```ts
 * import {pipe, map, wait, onEnd, catchError} from 'iter-ops';
 *
 * const i = pipe(
 *     iterable,
 *     map(a => myService.getValues(a)), // remap into requests-promises
 *     wait(), // resolve requests
 *     onEnd(s => {
 *         if(s.duration > 5000) {
 *             // took more than 5s to resolve all requests;
 *             throw new Error(`Performance issues in getValues requests, took ${s.duration}ms`);
 *         }
 *     }),
 *     catchError((err, ctx) => {
 *         console.log(err?.message || err);
 *         throw err;
 *     })
 * );
 * ```
 *
 * @see [[IIterationSummary]]
 * @category Sync+Async
 */
export function onEnd<T>(cb: (s: IIterationSummary<T>) => void): Operation<T, T> {
    return createOperation(onEndSync, onEndAsync, arguments);
}

function onEndSync<T>(iterable: Iterable<T>, cb: (s: IIterationSummary<T>) => void): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            let start: number, finished: boolean, lastValue: T, count = 0;
            return {
                next(): IteratorResult<T> {
                    start = start || Date.now();
                    const a = i.next();
                    if (a.done) {
                        if (!finished) {
                            finished = true;
                            cb({count, duration: Date.now() - start, lastValue, sync: true});
                        }
                    } else {
                        lastValue = a.value;
                        count++;
                    }
                    return a;
                }
            };
        }
    };
}

function onEndAsync<T>(iterable: AsyncIterable<T>, cb: (s: IIterationSummary<T>) => void): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            let start: number, finished: boolean, lastValue: T, count = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => {
                        start = start || Date.now();
                        if (a.done) {
                            if (!finished) {
                                finished = true;
                                cb({count, duration: Date.now() - start, lastValue, sync: false});
                            }
                        } else {
                            lastValue = a.value;
                            count++;
                        }
                        return a;
                    });
                }
            };
        }
    };
}
