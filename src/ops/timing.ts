import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Value timing details, produced by the [[timing]] operator.
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
 * Measures timings for each value, and provides a notification.
 *
 * The operator doesn't affect the iteration, unless the callback function throws an error.
 *
 * @see [[IValueTiming]], [[onEnd]]
 * @category Sync+Async
 */
export function timing<T>(cb: (t: IValueTiming<T>) => void): Operation<T, T> {
    return createOperation(timingSync, timingAsync, arguments);
}

function timingSync<T>(iterable: Iterable<T>, cb: (t: IValueTiming<T>) => void): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    const start = Date.now();
                    const a = i.next();
                    if (!a.done) {
                        const duration = Date.now() - start;
                        cb({duration, index: index++, value: a.value, state, sync: true});
                    }
                    return a;
                }
            };
        }
    };
}

function timingAsync<T>(iterable: AsyncIterable<T>, cb: (t: IValueTiming<T>) => void): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    const start = Date.now();
                    return i.next().then(a => {
                        if (!a.done) {
                            const duration = Date.now() - start;
                            cb({duration, index: index++, value: a.value, state, sync: false});
                        }
                        return a;
                    });
                }
            };
        }
    };
}
