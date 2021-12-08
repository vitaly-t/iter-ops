import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Starts emitting values, once the predicate returns a truthy value.
 */
export function start<T>(cb: (value: T, index: number, state: IterationState) => boolean): Operation<T, T> {
    return createOperation(startSync, startAsync, arguments);
}

function startSync<T>(iterable: Iterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = 0, finished = false;
            return {
                next(): IteratorResult<T> {
                    let a = i.next();
                    if (!finished) {
                        while (!a.done && !cb(a.value, index++, state)) {
                            a = i.next();
                        }
                        finished = true;
                    }
                    return a;
                }
            };
        }
    };
}

function startAsync<T>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): AsyncIterable<T> {
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
                        return finished ? a : this.next();
                    });
                }
            };
        }
    };
}
