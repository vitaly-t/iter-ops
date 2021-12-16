import {Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Iteration summary, produced by [[onFinish]] operator.
 */
export interface IIterationSummary<T> {
    /**
     * Number of items iterated.
     */
    count: number;

    /**
     * Time in ms it took to finish the iterable.
     */
    duration: number;

    /**
     * Last emitted value, if there was any (`undefined` otherwise).
     */
    lastValue: T | undefined;

    /**
     * Indication whether the iteration was synchronous.
     */
    sync: boolean;
}

/**
 * Notifies of the end of iteration, with a summary.
 *
 * @see [[IIterationSummary]]
 * @category Sync+Async
 */
export function onFinish<T>(cb: (s: IIterationSummary<T>) => void): Operation<T, T> {
    return createOperation(onFinishSync, onFinishAsync, arguments);
}

function onFinishSync<T>(iterable: Iterable<T>, cb: (s: IIterationSummary<T>) => void): Iterable<T> {
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

function onFinishAsync<T>(iterable: AsyncIterable<T>, cb: (s: IIterationSummary<T>) => void): AsyncIterable<T> {
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
                                cb({count, duration: Date.now() - start, lastValue, sync: true});
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
