import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Stops emitting values, once the predicate returns a truthy value.
 */
export function stop<T>(cb: (value: T, index: number, state: IterationState) => boolean): Operation<T, T> {
    return createOperation(stopSync, stopAsync, arguments);
}

function stopSync<T>(iterable: Iterable<T>, cb: (value: T, index: number, state: IterationState) => boolean): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = 0, done = false;
            return {
                next(): IteratorResult<T> {
                    if (!done) {
                        const a = i.next();
                        if (a.done || cb(a.value, index++, state)) {
                            done = true;
                        } else {
                            return a;
                        }
                    }
                    return {value: undefined, done};
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
            let index = 0, done = false;
            return {
                async next(): Promise<IteratorResult<T>> {
                    if (!done) {
                        const a = await i.next();
                        if (a.done || cb(a.value, index++, state)) {
                            done = true;
                        } else {
                            return a;
                        }
                    }
                    return {value: undefined, done};
                }
            };
        }
    };
}
