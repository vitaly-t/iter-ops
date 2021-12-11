import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Stops emitting values, once the predicate returns a truthy value.
 *
 * @category Sync+Async
 */
export function stop<T>(cb: (value: T, index: number, state: IterationState) => boolean): Operation<T, T> {
    return createOperation(stopSync, stopAsync, arguments);
}

function stopSync<T>(iterable: Iterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = 0, finished = false;
            return {
                next(): IteratorResult<T> {
                    const a = i.next();
                    if (!finished) {
                        finished = a.done || cb(a.value, index++, state);
                    }
                    if (finished || a.done) {
                        return {value: undefined, done: true};
                    }
                    return a;
                }
            };
        }
    };
}

function stopAsync<T>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            let index = 0, finished = false;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => {
                        if (!finished) {
                            finished = a.done || cb(a.value, index++, state);
                        }
                        if (finished || a.done) {
                            return {value: undefined, done: true};
                        }
                        return a;
                    });
                }
            };
        }
    };
}
