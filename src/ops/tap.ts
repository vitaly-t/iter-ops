import {IterationState, Operation} from '../types';
import {createOperation} from '../utils';

/**
 * Taps into each value, without changing the output.
 */
export function tap<T>(cb: (value: T, index: number, state: IterationState) => void): Operation<T, T> {
    return createOperation(tapSync, tapAsync, arguments);
}

function tapSync<T>(iterable: Iterable<T>, cb: (value: T, index: number, state: IterationState) => void): Iterable<T> {
    return {
        [Symbol.iterator](): Iterator<T> {
            const i = iterable[Symbol.iterator]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): IteratorResult<T> {
                    const a = i.next();
                    if (!a.done) {
                        cb(a.value, index++, state);
                    }
                    return a;
                }
            };
        }
    };
}

function tapAsync<T>(iterable: AsyncIterable<T>, cb: (value: T, index: number, state: IterationState) => void): AsyncIterable<T> {
    return {
        [Symbol.asyncIterator](): AsyncIterator<T> {
            const i = iterable[Symbol.asyncIterator]();
            const state: IterationState = {};
            let index = 0;
            return {
                next(): Promise<IteratorResult<T>> {
                    return i.next().then(a => {
                        if (!a.done) {
                            cb(a.value, index++, state);
                        }
                        return a;
                    });
                }
            };
        }
    };
}
