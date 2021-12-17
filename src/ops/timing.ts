import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

export interface IValueTiming<T> {
    value: T;
    index: number;
    state: IterationState;
    duration: number;
    sync: boolean;
}

/**
 * Measures timings for each value, and provides a notification.
 *
 * @category Sync+Async
 */
export function timing<T>(cb: (t: IValueTiming<T>) => void): Operation<T, T> {
    return createOperation(timingSync, timingAsync, arguments);
}

function timingSync<T>(iterable: Iterable<T>, cb: (t: IValueTiming<T>) => void): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            // const state: IterationState = {};
            // let index = 0, finished = false;
            return {
                next(): IteratorResult<T> {
                    return i.next();
                }
            };
        }
    };
}

function timingAsync<T>(iterable: AsyncIterable<T>, cb: (t: IValueTiming<T>) => void): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            // const state: IterationState = {};
            // let index = 0, finished = false;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next();
                }
            };
        }
    };
}
